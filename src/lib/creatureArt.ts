import type { CreatureInput } from '../models/Creature';

type Appearance = Pick<CreatureInput, 'family' | 'color' | 'temperament'>;

// Un dibujo hecho con SVG. No depende de imágenes ni servicios externos.
export function creatureArt(creature: Appearance, key: string): string {
  const gradientId = `skin-${key.replace(/[^a-z0-9-]/gi, '')}`;
  const color = creature.color;

  const details: Record<CreatureInput['family'], string> = {
    Nocturna: `
      <path d="M140 89 C129 63 108 54 107 35" stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M201 89 C211 63 232 54 233 35" stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <circle cx="107" cy="33" r="10" fill="#f5e7c7"/>
      <circle cx="233" cy="33" r="10" fill="#f5e7c7"/>
      <circle cx="107" cy="33" r="16" fill="none" stroke="#f5e7c7" opacity=".25"/>
      <circle cx="233" cy="33" r="16" fill="none" stroke="#f5e7c7" opacity=".25"/>
    `,
    Botánica: `
      <path d="M145 94 Q110 67 118 38 Q153 47 157 88" fill="${color}" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
      <path d="M192 90 Q183 47 219 30 Q229 68 203 99" fill="${color}" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
      <path d="M121 42 153 87 M218 33 196 90" stroke="#667c66" stroke-width="2" fill="none" opacity=".45"/>
      <path d="M170 86 C167 66 172 53 181 44" stroke="#80947e" stroke-width="3" fill="none"/>
    `,
    Cristalina: `
      <path d="M111 115 96 45 147 95 Z" fill="${color}" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
      <path d="M193 96 247 43 229 129 Z" fill="${color}" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
      <path d="M152 93 170 36 184 93" fill="${color}" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
      <path d="M96 45 121 101 M247 43 211 108 M170 36 174 91" stroke="#fff" stroke-width="1.5" opacity=".35"/>
    `,
    Abisal: `
      <path d="M106 132 56 105 72 161 102 167 Z" fill="${color}"/>
      <path d="M232 132 282 105 266 161 236 167 Z" fill="${color}"/>
      <path d="M57 106 102 156 M282 106 240 157" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
      <path d="M140 97 Q135 65 150 60 Q160 83 164 92 M194 95 Q199 64 187 59 Q177 81 172 91" fill="${color}"/>
    `
  };

  const eyes = creature.temperament === 'Esquiva'
    ? `<path d="M129 154 q13 -8 26 0 M185 154 q13 -8 26 0" fill="none" stroke="#27302f" stroke-width="6" stroke-linecap="round"/>`
    : creature.temperament === 'Indómita'
      ? `<path d="M129 147 l26 -6 M185 141 l26 6" stroke="#27302f" stroke-width="4" stroke-linecap="round"/>
         <ellipse cx="144" cy="157" rx="7" ry="11" fill="#27302f"/>
         <ellipse cx="196" cy="157" rx="7" ry="11" fill="#27302f"/>`
      : `<ellipse cx="143" cy="153" rx="8" ry="11" fill="#27302f"/>
         <ellipse cx="197" cy="153" rx="8" ry="11" fill="#27302f"/>
         <circle cx="146" cy="149" r="2.7" fill="#fff"/>
         <circle cx="200" cy="149" r="2.7" fill="#fff"/>`;

  const mouth = creature.temperament === 'Indómita'
    ? '<path d="M162 181 Q170 175 178 181" stroke="#27302f" stroke-width="2.6" stroke-linecap="round" fill="none"/>'
    : '<path d="M164 177 Q170 183 176 177" stroke="#27302f" stroke-width="2.6" stroke-linecap="round" fill="none"/>';

  return `
    <svg class="specimen-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 250" focusable="false" aria-hidden="true">
      <defs>
        <radialGradient id="${gradientId}" cx="36%" cy="22%" r="82%">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".58"/>
          <stop offset=".38" stop-color="${color}"/>
          <stop offset="1" stop-color="${color}" stop-opacity=".87"/>
        </radialGradient>
      </defs>
      <circle cx="170" cy="128" r="105" fill="none" stroke="currentColor" stroke-opacity=".13" stroke-width="1" stroke-dasharray="3 7"/>
      <path d="M46 127 h24 M270 127 h24 M170 12 v16 M170 229 v10" stroke="currentColor" stroke-opacity=".15" stroke-width="1"/>
      <ellipse cx="171" cy="220" rx="65" ry="8" fill="#212421" opacity=".10"/>
      <path d="M125 193 Q112 216 127 218 L153 215 L153 193 M188 193 L188 216 212 217 Q226 214 215 193"
            fill="${color}" stroke="#26302b" stroke-opacity=".10" stroke-width="2"/>
      ${details[creature.family]}
      <path d="M111 122 Q76 149 88 174 Q97 186 111 173 M229 122 Q262 149 251 174 Q245 186 229 173"
            fill="${color}" stroke="#26302b" stroke-opacity=".10" stroke-width="2"/>
      <path d="M101 159 C94 111 113 88 170 88 C225 88 246 114 239 165
               C234 202 207 214 170 213 C128 213 107 196 101 159 Z"
            fill="url(#${gradientId})" stroke="#26302b" stroke-opacity=".10" stroke-width="2"/>
      <ellipse cx="170" cy="188" rx="35" ry="18" fill="#fff" opacity=".13"/>
      ${eyes}
      ${mouth}
      <circle cx="117" cy="172" r="8" fill="#c57c79" opacity=".20"/>
      <circle cx="222" cy="172" r="8" fill="#c57c79" opacity=".20"/>
    </svg>
  `;
}
