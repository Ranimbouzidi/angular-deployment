import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/UserService';
import { DatePipe } from '@angular/common';

interface ChatMessage {
  type: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  content: string;
  timestamp: string;
  reactions?: {
    [userId: string]: string; // userId -> reaction emoji
  };
  messageId?: string; // For reaction messages
  reaction?: string; // For reaction messages
  isEditing?: boolean;
  edited?: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DatePipe]
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly WS_URL = 'ws://localhost:8081/ws/chat';
  private readonly MESSAGES_STORAGE_KEY = 'chat_messages';
  public ws: WebSocket | null = null;
  public connectionStatus: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  public WebSocket = WebSocket; // Make WebSocket available in template
  public Object = Object; // Make Object available in template
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000; // 3 seconds
  private isDestroyed = false;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUser: User;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  errorMessage: string = '';

  // Add these new properties
  availableReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  selectedMessageId: string | null = null;
  editingMessage: ChatMessage | null = null;
  editedContent: string = '';
  searchQuery: string = '';
  filteredMessages: ChatMessage[] = [];
  isSearching: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit() {
    // Get current user from localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      this.errorMessage = 'No user data found. Please log in again.';
      return;
    }

    // Get receiver info from route params
    this.route.queryParams.subscribe(params => {
      this.receiverId = params.userId;
      this.receiverName = params.userName;
      this.receiverEmail = params.userEmail;
      
      if (!this.receiverId || !this.receiverName) {
        this.errorMessage = 'Invalid chat parameters. Please select a user to chat with.';
        return;
      }

      // Load stored messages for this chat
      this.loadStoredMessages();
      
      // Initialize WebSocket connection
      this.initializeWebSocket();
    });
  }

  private loadStoredMessages() {
    const storedMessages = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      const allMessages = JSON.parse(storedMessages);
      // Filter messages for current chat
      this.messages = allMessages.filter((msg: ChatMessage) => 
        (msg.senderId === this.currentUser.id.toString() && msg.receiverId === this.receiverId) ||
        (msg.senderId === this.receiverId && msg.receiverId === this.currentUser.id.toString())
      );
    }
  }

  private storeMessage(message: ChatMessage) {
    const storedMessages = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
    let allMessages: ChatMessage[] = [];
    
    if (storedMessages) {
      allMessages = JSON.parse(storedMessages);
    }
    
    allMessages.push(message);
    localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
  }

  private initializeWebSocket() {
    if (this.isDestroyed) return;

    this.connectionStatus = 'connecting';
    this.errorMessage = '';

    try {
      console.log('Attempting to connect to WebSocket at:', this.WS_URL);
      this.ws = new WebSocket(this.WS_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        this.errorMessage = '';
        
        // Send identification message
        const identificationMessage = {
          type: 'IDENTIFICATION',
          senderId: this.currentUser.id.toString(),
          senderName: `${this.currentUser.prenom} ${this.currentUser.nom}`,
          senderEmail: this.currentUser.email,
          receiverId: this.receiverId,
          content: '',
          timestamp: new Date().toISOString()
        };
        
        console.log('Sending identification message:', identificationMessage);
        this.ws?.send(JSON.stringify(identificationMessage));
      };

      this.ws.onmessage = (event) => {
        try {
          console.log('Received WebSocket message:', event.data);
          const message = JSON.parse(event.data);
          console.log('Parsed message:', message);
          
          if (message.type === 'CHAT') {
            if (message.content.startsWith('REACTION:')) {
              // Check if this is a reaction message
              const reactionMatch = message.content.match(/REACTION:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z):(.+)$/);
              if (reactionMatch && reactionMatch.length >= 3) {
                const messageId = reactionMatch[1];
                const reaction = reactionMatch[2];
                
                console.log('Extracted reaction data:', { messageId, reaction });
                
                // Find the target message by comparing timestamps
                const targetMessage = this.messages.find(m => m.timestamp === messageId);
                
                if (targetMessage) {
                  console.log('Found target message:', targetMessage);
                  if (!targetMessage.reactions) {
                    targetMessage.reactions = {};
                  }
                  
                  if (reaction) {
                    // Add or update reaction
                    targetMessage.reactions[message.senderId] = reaction;
                    console.log('Updated reactions:', targetMessage.reactions);
                  }
                  
                  // Update stored messages
                  this.updateStoredMessages();
                  
                  // Force change detection
                  this.messages = [...this.messages];
                } else {
                  console.log('Target message not found. Looking for timestamp:', messageId);
                  console.log('Available messages:', this.messages.map(m => m.timestamp));
                }
              } else {
                console.error('Invalid reaction message format:', message.content);
              }
            } else if (message.content.startsWith('EDIT:')) {
              // Handle edit message
              const editMatch = message.content.match(/EDIT:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z):(.+)$/);
              if (editMatch && editMatch.length >= 3) {
                const messageId = editMatch[1];
                const newContent = editMatch[2];
                
                const targetMessage = this.messages.find(m => m.timestamp === messageId);
                if (targetMessage) {
                  targetMessage.content = newContent;
                  targetMessage.edited = true;
                  this.updateStoredMessages();
                  this.messages = [...this.messages];
                }
              }
            } else {
              // Regular chat message
              this.messages.push(message);
              this.storeMessage(message);
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          this.errorMessage = 'Error receiving message. Please try again.';
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionStatus = 'disconnected';
        this.errorMessage = 'Connection error. Attempting to reconnect...';
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.connectionStatus = 'disconnected';
        
        if (!this.isDestroyed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          this.errorMessage = `Connection lost. Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.initializeWebSocket(), this.reconnectTimeout);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.errorMessage = 'Failed to establish connection. Please refresh the page.';
        }
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.connectionStatus = 'disconnected';
      this.errorMessage = 'Failed to connect to chat server. Please try again later.';
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.errorMessage = 'Connection lost. Attempting to reconnect...';
        this.initializeWebSocket();
      }
      return;
    }

    const message: ChatMessage = {
      type: 'CHAT',
      senderId: this.currentUser.id.toString(),
      senderName: `${this.currentUser.prenom} ${this.currentUser.nom}`,
      senderEmail: this.currentUser.email,
      receiverId: this.receiverId,
      content: this.newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      console.log('Sending chat message:', message);
      this.ws.send(JSON.stringify(message));
      this.newMessage = '';
      this.errorMessage = '';
    } catch (error) {
      console.error('Error sending message:', error);
      this.connectionStatus = 'disconnected';
      this.errorMessage = 'Error sending message. Attempting to reconnect...';
      this.initializeWebSocket();
    }
  }

  formatTimestamp(timestamp: string): string {
    return this.datePipe.transform(timestamp, 'shortTime') || '';
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Add this new method
  addReaction(message: ChatMessage, reaction: string) {
    console.log('Adding reaction:', { message, reaction });
    if (!message.reactions) {
      message.reactions = {};
    }
    
    // Toggle reaction - if user already reacted with this emoji, remove it
    if (message.reactions[this.currentUser.id.toString()] === reaction) {
      delete message.reactions[this.currentUser.id.toString()];
    } else {
      message.reactions[this.currentUser.id.toString()] = reaction;
    }

    // Send reaction update to WebSocket
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const reactionMessage = {
        type: 'CHAT',
        senderId: this.currentUser.id.toString(),
        senderName: this.currentUser.prenom + ' ' + this.currentUser.nom,
        senderEmail: this.currentUser.email,
        receiverId: this.receiverId,
        content: `REACTION:${message.timestamp}:${reaction}`,
        timestamp: new Date().toISOString()
      };
      console.log('Sending reaction message:', reactionMessage);
      this.ws.send(JSON.stringify(reactionMessage));
    }

    // Update stored messages
    this.updateStoredMessages();
  }

  // Add this helper method
  private updateStoredMessages() {
    const storedMessages = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      const allMessages = JSON.parse(storedMessages);
      const updatedMessages = allMessages.map((msg: ChatMessage) => {
        const currentMessage = this.messages.find(m => m.timestamp === msg.timestamp);
        return currentMessage || msg;
      });
      localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
    }
  }

  // Add these new methods
  startEditing(message: ChatMessage) {
    if (message.senderId === this.currentUser.id.toString()) {
      this.editingMessage = message;
      this.editedContent = message.content;
      message.isEditing = true;
    }
  }

  cancelEditing(message: ChatMessage) {
    message.isEditing = false;
    this.editingMessage = null;
    this.editedContent = '';
  }

  saveEdit(message: ChatMessage) {
    if (this.editedContent.trim() && this.editedContent !== message.content) {
      const originalContent = message.content;
      message.content = this.editedContent;
      message.edited = true;
      message.isEditing = false;

      // Send edit message through WebSocket
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const editMessage = {
          type: 'CHAT',
          senderId: this.currentUser.id.toString(),
          senderName: this.currentUser.prenom + ' ' + this.currentUser.nom,
          senderEmail: this.currentUser.email,
          receiverId: this.receiverId,
          content: `EDIT:${message.timestamp}:${this.editedContent}`,
          timestamp: new Date().toISOString()
        };
        this.ws.send(JSON.stringify(editMessage));
      }

      // Update stored messages
      this.updateStoredMessages();
    }
    this.editingMessage = null;
    this.editedContent = '';
  }

  // Add this new method
  searchMessages() {
    if (!this.searchQuery.trim()) {
      this.isSearching = false;
      this.filteredMessages = [];
      return;
    }

    this.isSearching = true;
    const query = this.searchQuery.toLowerCase();
    this.filteredMessages = this.messages.filter(message => 
      message.content.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearching = false;
    this.filteredMessages = [];
  }

  // Update the messages getter to handle search
  get displayMessages(): ChatMessage[] {
    return this.isSearching ? this.filteredMessages : this.messages;
  }

  terminateChat() {
    // Close WebSocket connection if it's open
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    
    // Navigate back to the users page with the correct path
    this.router.navigate(['/compte/admin/utilisateurs']);
  }
} 

