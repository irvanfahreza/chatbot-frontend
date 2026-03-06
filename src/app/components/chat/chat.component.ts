import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
    private chatService = inject(ChatService);

    sessionId: string = '';
    messages: ChatMessage[] = [];
    newMessage: string = '';
    isLoading: boolean = false;

    @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

    ngOnInit() {
        this.initSession();
        this.loadHistory();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private initSession() {
        let session = localStorage.getItem('chat_session_id');
        if (!session) {
            session = crypto.randomUUID();
            localStorage.setItem('chat_session_id', session);
        }
        this.sessionId = session;
    }

    private loadHistory() {
        this.isLoading = true;
        this.chatService.getHistory(this.sessionId).subscribe({
            next: (history) => {
                this.messages = history;

                // If this is a brand new session, establish Irvan's intro message
                if (this.messages.length === 0) {
                    this.messages.push({
                        message: "Hi, I'm Irvan 👋\nYour Intelligent Responsive Virtual Assistant",
                        role: 'assistant',
                        timestamp: new Date().toISOString()
                    });
                }

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load history', err);
                this.isLoading = false;
            }
        });
    }

    sendMessage() {
        if (!this.newMessage.trim() || this.isLoading) return;

        const userMsg: ChatMessage = {
            message: this.newMessage,
            role: 'user',
            timestamp: new Date().toISOString()
        };

        this.messages.push(userMsg);
        const textToSend = this.newMessage;
        this.newMessage = '';
        this.isLoading = true;

        this.chatService.sendMessage(this.sessionId, textToSend).subscribe({
            next: (response) => {
                const botMsg: ChatMessage = {
                    message: response.response,
                    role: 'assistant',
                    timestamp: response.timestamp
                };
                this.messages.push(botMsg);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to send message', err);
                this.isLoading = false;
            }
        });
    }

    resetSession() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.chatService.clearSession(this.sessionId).subscribe({
                next: () => {
                    this.messages = [{
                        message: "Hi, I'm Irvan 👋\nYour Intelligent Responsive Virtual Assistant",
                        role: 'assistant',
                        timestamp: new Date().toISOString()
                    }];
                    localStorage.removeItem('chat_session_id');
                    this.initSession();
                },
                error: (err) => console.error('Failed to clear session', err)
            });
        }
    }

    private scrollToBottom(): void {
        try {
            this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
