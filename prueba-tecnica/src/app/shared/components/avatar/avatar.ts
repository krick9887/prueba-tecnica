import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrls: ['./avatar.scss']
})
export class AvatarComponent {
  @Input() imageUrl?: string;
  @Input() name: string = 'Usuario';
  @Input() size: number = 50;

  defaultAvatar: string = 'https://ui-avatars.com/api/?name=User&background=0D6EFD&color=fff';

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=0D6EFD&color=fff`;
  }
}