'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string; // ISO: "2026-03-15"
  targetTime: string; // "17:00"
  timezone: string;   // "America/Mexico_City"
}

export default function Countdown({ targetDate, targetTime, timezone }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    // Build target date with timezone offset
    // For Mexico City standard time (Nov-Apr): UTC-6
    const target = new Date(`${targetDate}T${targetTime}:00-06:00`);

    function update() {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime, timezone]);

  const dateFormatted = formatDateShort(targetDate, targetTime);

  return (
    <section id="countdown" className="countdown-section">
      <div className="section-container">
        <h2 className="section-title animate-on-scroll">
          {isPast ? '¡Es Hoy!' : 'Faltan'}
        </h2>
        <div className="countdown-timer animate-on-scroll">
          <div className="countdown-item">
            <span id="days" className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Días</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span id="hours" className="countdown-number">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="countdown-label">Horas</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span id="minutes" className="countdown-number">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="countdown-label">Minutos</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span id="seconds" className="countdown-number">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="countdown-label">Segundos</span>
          </div>
        </div>
        <p className="countdown-date animate-on-scroll">{dateFormatted}</p>
      </div>
    </section>
  );
}

function formatDateShort(isoDate: string, time: string): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const [year, month, day] = isoDate.split('-').map(Number);
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h > 12 ? h - 12 : h;
  return `${day} de ${months[month - 1]} del ${year} • ${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
