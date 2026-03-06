import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ChatMessage, ChatResponse } from '../models/chat.model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    sendMessage(sessionId: string, message: string): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(`${this.apiUrl}/send`, { sessionId, message });
    }

    getHistory(sessionId: string): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${sessionId}`);
    }

    clearSession(sessionId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/session/${sessionId}`);
    }
}
