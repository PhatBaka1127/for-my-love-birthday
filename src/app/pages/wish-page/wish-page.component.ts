import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wish-page',
  templateUrl: './wish-page.component.html',
  styleUrls: ['./wish-page.component.css'],
})
export class WishPageComponent implements OnInit, OnDestroy {
  // 🔊 Nhạc nền
  private bgMusic = new Audio('assets/musics/music.m4a');
  private fadeOutInterval: any;
  private fadeInInterval: any;

  wishes = [
    {
      img: 'assets/images/loves/love1.png',
      text: 'Chúc em sinh nhật thật vui, thật nhiều năng lượng tích cực, và cười nhiều hơn tất cả những ngày trước cộng lại 💙',
    },
    {
      img: 'assets/images/loves/love2.png',
      text: 'Cảm ơn em vì đã xuất hiện và làm cuộc sống của anh rực rỡ hơn bất kỳ khoảng trời xanh nào anh từng thấy ✨',
    },
    {
      img: 'assets/images/loves/love3.png',
      text: 'Mong rằng mọi điều em ước, dù nhỏ hay lớn, đều sẽ trở thành sự thật. Còn anh sẽ ở đây — luôn cổ vũ em, và luôn tự hào về em.',
    },
    {
      img: 'assets/images/loves/love4.png',
      text: 'Hôm nay là ngày của em… nên chỉ cần em vui, chỉ cần em hạnh phúc, còn mọi thứ còn lại… để anh lo. 💑',
    },
    {
      img: 'assets/images/loves/love5.png',
      text: 'Đúng ra ở đây anh tính để thêm những bức ảnh kỉ niệm thật xịn của hai đứa mình 📸',
    },
    {
      img: 'assets/images/loves/love6.png',
      text: 'Nhưng mà… tụi mình vẫn chưa có được tấm nào thật sự “đúng nghĩa” chụp chung hết 😅',
    },
    {
      img: 'assets/images/loves/love7.png',
      text: 'Nên anh mong tụi mình sẽ có thật nhiều khoảnh khắc đẹp, thật nhiều tấm hình để sau này nhìn lại.',
    },
    {
      img: 'assets/images/loves/love8.png',
      text: 'Anh thương em, đơn giản vậy thôi 💙 và anh nghĩ… như vậy là đủ để anh luôn ở cạnh em.',
    },
    {
      text: 'Và… đây là món quà nhỏ của anh, mong em sẽ thích🎁💙',
    },
  ];

  currentIndex = 0;

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex === this.wishes.length - 1;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ───────────────── LIFECYCLE ─────────────────

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id')) || 1;
      this.setIndexFromRoute(id);
    });

    this.spawnCats();
    this.startMusic();
  }

  ngOnDestroy(): void {
    this.clearFadeIntervals();
    this.stopMusic();
  }

  // ───────────────── NHẠC NỀN ─────────────────

  startMusic() {
    this.clearFadeIntervals();
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3; // âm lượng mặc định nhẹ nhàng

    // Nếu đã pause trước đó thì play lại
    this.bgMusic.play().catch((err) => {
      console.log('Autoplay có thể bị chặn, cần user tương tác trước:', err);
    });
  }

  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  private clearFadeIntervals() {
    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    }
    if (this.fadeInInterval) {
      clearInterval(this.fadeInInterval);
      this.fadeInInterval = null;
    }
  }

  private fadeOutMusic() {
    this.clearFadeIntervals();

    this.fadeOutInterval = setInterval(() => {
      if (this.bgMusic.volume > 0.05) {
        this.bgMusic.volume = this.bgMusic.volume - 0.05;
      } else {
        this.bgMusic.volume = 0;
        this.bgMusic.pause();
        clearInterval(this.fadeOutInterval);
        this.fadeOutInterval = null;
      }
    }, 80);
  }

  private fadeInMusic() {
    this.clearFadeIntervals();

    // Nếu nhạc đang dừng thì play lại từ đầu, nhưng volume nhỏ
    if (this.bgMusic.paused) {
      this.bgMusic.volume = 0;
      this.bgMusic.play().catch((err) => {
        console.log('Không play lại được bgMusic:', err);
      });
    }

    this.fadeInInterval = setInterval(() => {
      if (this.bgMusic.volume < 0.3) {
        this.bgMusic.volume = this.bgMusic.volume + 0.05;
      } else {
        this.bgMusic.volume = 0.3;
        clearInterval(this.fadeInInterval);
        this.fadeInInterval = null;
      }
    }, 80);
  }

  // ───────────────── VIDEO EVENTS ─────────────────

  onVideoPlay(): void {
    this.fadeOutMusic();
  }

  onVideoPause(): void {
    this.fadeInMusic();
  }

  onVideoEnded(): void {
    this.fadeInMusic();
  }

  // ───────────────── ROUTE & WISH NAV ─────────────────

  private setIndexFromRoute(id: number): void {
    const max = this.wishes.length;
    if (id < 1 || id > max) {
      this.router.navigateByUrl('/not-found');
      return;
    }
    this.currentIndex = id - 1;
  }

  goPrev(): void {
    if (!this.isFirst) {
      const prev = this.currentIndex;
      this.router.navigate(['/wishes', prev]);
    }
  }

  goNext(): void {
    if (!this.isLast) {
      const next = this.currentIndex + 2;
      this.router.navigate(['/wishes', next]);
    }
  }

  goBackToFirstWish(): void {
    this.router.navigate(['/wishes', 1]);
  }

  // ───────────────── MÈO RƠI ─────────────────

  spawnCats() {
    const totalCats = 19;
    const container = document.body;

    for (let i = 0; i < totalCats; i++) {
      const img = document.createElement('img');
      img.src = `assets/images/cats/cat${(i % 19) + 1}.png`;
      img.classList.add('falling-cat');

      img.style.left = Math.random() * 100 + 'vw';
      img.style.animationDuration = 5 + Math.random() * 6 + 's';
      img.style.animationDelay = Math.random() * 4 + 's';
      img.style.width = 50 + Math.random() * 50 + 'px';

      container.appendChild(img);
    }
  }
}
