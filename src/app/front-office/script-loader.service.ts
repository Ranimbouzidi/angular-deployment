import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private loadedScripts: any = {};

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts[src]) {
        resolve(); // already loaded
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        this.loadedScripts[src] = true;
        resolve();
      };
      script.onerror = () => reject(`Script load error: ${src}`);
      document.body.appendChild(script);
    });
  }
}
