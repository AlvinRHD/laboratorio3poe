interface TourStep {
  target: string;
  title: string;
  text: string;
}

const steps: TourStep[] = [
  {
    target: '#new-creature',
    title: 'Crea una criatura',
    text: 'Este es el punto de partida. Abre el taller para inventar una especie y elegir su apariencia.'
  },
  {
    target: '.archive-tools',
    title: 'Encuentra a tus criaturas',
    text: 'Busca por nombre o hábitat y usa el selector para mostrar solo una familia.'
  },
  {
    target: '.creature-card .card-details',
    title: 'Lee cada descubrimiento',
    text: 'Aquí viven las fichas: nombre, carácter, hábitat y rasgos de cada criatura.'
  },
  {
    target: '.creature-card .card-actions',
    title: 'Tu mundo puede cambiar',
    text: 'Edita cualquier especie o elimínala. Los cambios se reflejan de inmediato en el archivo.'
  },
  {
    target: '#about-title',
    title: 'Tus hallazgos permanecen',
    text: 'BESTIARIO guarda sus criaturas con SQLite en este navegador. Puedes cerrar la página y regresar después.'
  }
];

export class ExplorerTour {
  private layer = document.querySelector<HTMLElement>('#tour')!;
  private spotlight = document.querySelector<HTMLElement>('#tour-spotlight')!;
  private card = document.querySelector<HTMLElement>('.tour-card')!;
  private count = document.querySelector<HTMLElement>('#tour-count')!;
  private title = document.querySelector<HTMLElement>('#tour-title')!;
  private text = document.querySelector<HTMLElement>('#tour-text')!;
  private dots = document.querySelector<HTMLElement>('#tour-dots')!;
  private previous = document.querySelector<HTMLButtonElement>('#tour-prev')!;
  private next = document.querySelector<HTMLButtonElement>('#tour-next')!;
  private site = document.querySelector<HTMLElement>('.site-shell')!;

  private current = 0;
  private itinerary = steps;
  private launcher: HTMLElement | null = null;
  private frame = 0;

  init(): void {
    ['#start-tour', '#tour-replay'].forEach(selector => {
      document.querySelector(selector)?.addEventListener('click', () => this.open());
    });

    document.querySelector('#tour-close')?.addEventListener('click', () => this.close());
    this.previous.addEventListener('click', () => this.go(-1));
    this.next.addEventListener('click', () => this.go(1));

    // El fondo sirve para salir sin hacer clic en elementos de la página.
    this.layer.addEventListener('click', event => {
      if (event.target === this.layer) this.close();
    });

    document.addEventListener('keydown', event => this.onKeydown(event));
    window.addEventListener('resize', () => this.place());
    window.addEventListener('scroll', () => this.place(), { passive: true });
  }

  private open(): void {
    this.launcher = document.activeElement as HTMLElement;
    this.current = 0;
    // Sin criaturas todavía, omitimos las paradas de edición y fichas.
    this.itinerary = steps.filter(step =>
      !step.target.startsWith('.creature-card') ||
      Boolean(document.querySelector('.creature-card'))
    );
    this.layer.hidden = false;
    this.site.inert = true;
    this.showStep();
    document.querySelector<HTMLButtonElement>('#tour-close')?.focus();
  }

  private close(): void {
    if (this.layer.hidden) return;

    this.layer.hidden = true;
    this.site.inert = false;
    window.cancelAnimationFrame(this.frame);
    this.launcher?.focus({ preventScroll: true });
  }

  private go(direction: number): void {
    if (direction > 0 && this.current === this.itinerary.length - 1) {
      this.close();
      return;
    }

    this.current = Math.max(0, Math.min(this.itinerary.length - 1, this.current + direction));
    this.showStep();
  }

  private showStep(): void {
    const step = this.itinerary[this.current];
    this.count.textContent = `${String(this.current + 1).padStart(2, '0')} / ${String(this.itinerary.length).padStart(2, '0')}`;
    this.title.textContent = step.title;
    this.text.textContent = step.text;
    this.previous.disabled = this.current === 0;
    this.next.textContent = this.current === this.itinerary.length - 1 ? 'Terminar ✓' : 'Siguiente →';
    this.dots.innerHTML = this.itinerary.map((_, index) =>
      `<i class="${index === this.current ? 'active' : ''}"></i>`
    ).join('');

    const target = document.querySelector<HTMLElement>(step.target);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth',
      block: window.innerWidth <= 700 ? 'start' : 'center'
    });

    this.place();
  }

  private place(): void {
    if (this.layer.hidden) return;
    window.cancelAnimationFrame(this.frame);

    this.frame = window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(this.itinerary[this.current].target);
      if (!target) return;

      const box = target.getBoundingClientRect();
      const gap = 8;
      const top = Math.max(6, box.top - gap);
      const left = Math.max(6, box.left - gap);
      const width = Math.min(box.width + gap * 2, window.innerWidth - left - 6);
      const height = Math.min(box.height + gap * 2, window.innerHeight - top - 6);

      Object.assign(this.spotlight.style, {
        top: `${top}px`,
        left: `${left}px`,
        width: `${Math.max(0, width)}px`,
        height: `${Math.max(0, height)}px`
      });

      if (window.innerWidth <= 700) return;

      const cardWidth = this.card.offsetWidth;
      const cardHeight = this.card.offsetHeight;
      const availableBelow = window.innerHeight - box.bottom;
      const preferredTop = availableBelow > cardHeight + 26
        ? box.bottom + 22
        : box.top - cardHeight - 22;

      const cardLeft = Math.min(
        window.innerWidth - cardWidth - 16,
        Math.max(16, box.left)
      );
      const cardTop = Math.min(
        window.innerHeight - cardHeight - 16,
        Math.max(16, preferredTop)
      );

      this.card.style.left = `${cardLeft}px`;
      this.card.style.top = `${cardTop}px`;
    });
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.layer.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.go(1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.go(-1);
    }

    if (event.key === 'Tab') {
      const buttons = [...this.card.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
}
