import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wish-page',
  templateUrl: './wish-page.component.html',
  styleUrls: ['./wish-page.component.css'],
})
export class WishPageComponent implements OnInit, OnDestroy {

  private bgMusic = new Audio('assets/musics/music.m4a');
  private fadeOutInterval: any;
  private fadeInInterval: any;

  /** STATE MANAGEMENT **/
  isMusicPlaying = false;
  userMuted = false;
  videoPlaying = false;

  wishes = [
    { img: 'assets/images/loves/love1.png', text: 'Chúc em sinh nhật thật vui, thật nhiều năng lượng tích cực, và cười nhiều hơn tất cả những ngày trước cộng lại 💙' },
    { img: 'assets/images/loves/love2.png', text: 'Cảm ơn em vì đã xuất hiện và làm cuộc sống của anh rực rỡ hơn bất kỳ khoảng trời xanh nào anh từng thấy ✨' },
    { img: 'assets/images/loves/love3.png', text: 'Mong rằng mọi điều em ước, dù nhỏ hay lớn, đều sẽ trở thành sự thật. Còn anh sẽ ở đây — luôn cổ vũ em, và luôn tự hào về em.' },
    { img: 'assets/images/loves/love4.png', text: 'Hôm nay là ngày của em… nên chỉ cần em vui, chỉ cần em hạnh phúc, còn mọi thứ còn lại… để anh lo. 💑' },
    { img: 'assets/images/loves/love5.png', text: 'Đúng ra ở đây anh tính để thêm những bức ảnh kỉ niệm thật xịn của hai đứa mình 📸' },
    { img: 'assets/images/loves/love6.png', text: 'Nhưng mà… tụi mình vẫn chưa có được tấm nào thật sự “đúng nghĩa” chụp chung hết 😅' },
    { img: 'assets/images/loves/love7.png', text: 'Nên anh mong tụi mình sẽ có thật nhiều khoảnh khắc đẹp, thật nhiều tấm hình để sau này nhìn lại.' },
    { img: 'assets/images/loves/love8.png', text: 'Anh thương em, đơn giản vậy thôi 💙 và anh nghĩ… như vậy là đủ để anh luôn ở cạnh em.' },
    { text: 'Và… đây là món quà nhỏ của anh, mong em sẽ thích🎁💙' },
  ];

  currentIndex = 0;

  get isFirst() { return this.currentIndex === 0; }
  get isLast() { return this.currentIndex === this.wishes.length - 1; }

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id')) || 1;
      this.setIndexFromRoute(id);
    });

    this.spawnCats();
    this.initMusicState();
  }

  ngOnDestroy() {
    this.clearFade();
    this.bgMusic.pause();
  }

  /** -------- MUSIC CORE -------- **/

  initMusicState() {
    this.userMuted = localStorage.getItem('musicMuted') === 'true';

    const firstTime = !localStorage.getItem('musicPlayed');
    if (firstTime && !this.userMuted) {
      this.fadeInMusic();
      localStorage.setItem('musicPlayed', 'true');
    }
  }

  toggleMusic() {
    this.userMuted = !this.userMuted;
    localStorage.setItem('musicMuted', String(this.userMuted));
    this.applyMusicState();
  }

  applyMusicState() {
    if (this.userMuted || this.videoPlaying) {
      this.fadeOutMusic();
    } else {
      this.fadeInMusic();
    }
  }

  fadeInMusic() {
    this.clearFade();
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0;

    this.bgMusic.play().then(() => {
      this.isMusicPlaying = true;
      this.fadeInInterval = setInterval(() => {
        if (this.bgMusic.volume < 0.3) this.bgMusic.volume += 0.05;
        else clearInterval(this.fadeInInterval);
      }, 100);
    });
  }

  fadeOutMusic() {
    this.clearFade();
    this.fadeOutInterval = setInterval(() => {
      if (this.bgMusic.volume > 0.05) this.bgMusic.volume -= 0.05;
      else {
        this.bgMusic.volume = 0;
        this.bgMusic.pause();
        this.isMusicPlaying = false;
        clearInterval(this.fadeOutInterval);
      }
    }, 100);
  }

  clearFade() {
    clearInterval(this.fadeInInterval);
    clearInterval(this.fadeOutInterval);
  }

  /** -------- VIDEO EVENTS -------- **/

  onVideoPlay() {
    this.videoPlaying = true;
    this.applyMusicState();
  }

  onVideoPause(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.videoPlaying = !video.ended && !video.paused;
    this.applyMusicState();
  }

  onVideoEnded() {
    this.videoPlaying = false;
    this.applyMusicState();
  }

  /** -------- NAV -------- **/

  private setIndexFromRoute(id: number): void {
    if (id < 1 || id > this.wishes.length) {
      this.router.navigateByUrl('/not-found');
      return;
    }
    this.currentIndex = id - 1;
  }

  goPrev() { if (!this.isFirst) this.router.navigate(['/wishes', this.currentIndex]); }
  goNext() { if (!this.isLast) this.router.navigate(['/wishes', this.currentIndex + 2]); }
  goBackToFirstWish() { this.router.navigate(['/wishes', 1]); }

  /** --------- ANIMATION MÈO -------- **/
  spawnCats() {
    const total = 19;
    for (let i = 0; i < total; i++) {
      const img = document.createElement('img');
      img.src = `assets/images/cats/cat${(i % 19) + 1}.png`;
      img.classList.add('falling-cat');
      img.style.left = Math.random() * 100 + 'vw';
      img.style.animationDuration = 5 + Math.random() * 4 + 's';
      img.style.animationDelay = Math.random() * 3 + 's';
      img.style.width = 50 + Math.random() * 50 + 'px';
      document.body.appendChild(img);
    }
  }
}
