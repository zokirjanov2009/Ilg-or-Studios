import { motion } from 'framer-motion'

export function BrainSchematic() {
  return (
    <motion.svg
      viewBox="0 0 920 520"
      className="h-[360px] w-[360px] md:h-[720px] md:w-[720px]"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(226,232,240,0.92)" />
          <stop offset="60%" stopColor="rgba(226,232,240,0.70)" />
          <stop offset="100%" stopColor="rgba(226,232,240,0.86)" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 .55 0"
            result="g"
          />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer brain silhouette (side view) */}
      <path
        d="M220 240
           C188 178 214 116 278 94
           C314 50 384 34 450 60
           C512 30 594 44 636 90
           C710 106 744 160 726 224
           C772 268 754 342 692 366
           C664 414 590 452 512 430
           C468 462 404 462 366 436
           C316 468 250 440 236 388
           C194 364 176 304 202 268
           C206 258 214 250 220 240 Z"
        fill="none"
        stroke="url(#stroke)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* Cerebellum */}
      <path
        d="M604 362
           C650 350 686 378 686 410
           C686 444 650 472 604 462
           C566 454 548 428 558 402
           C566 382 582 370 604 362 Z"
        fill="none"
        stroke="rgba(226,232,240,0.70)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M572 400
           C594 386 618 386 640 400
           C618 414 594 414 572 400 Z"
        fill="none"
        stroke="rgba(226,232,240,0.38)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Brainstem */}
      <path
        d="M528 380
           C520 408 528 430 546 452
           C560 470 560 486 548 500
           C540 508 530 510 520 506
           C512 502 508 492 512 480
           C516 466 506 450 490 438
           C472 424 472 406 486 394
           C498 382 514 374 528 380 Z"
        fill="none"
        stroke="rgba(226,232,240,0.62)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lobe separators (approx like reference) */}
      <path
        d="M396 86
           C394 118 414 138 444 156
           C468 170 486 190 494 218"
        fill="none"
        stroke="rgba(226,232,240,0.45)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M520 96
           C520 134 546 152 576 172
           C610 194 624 220 624 252"
        fill="none"
        stroke="rgba(226,232,240,0.45)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M636 140
           C666 166 682 190 684 220
           C686 254 666 276 638 292"
        fill="none"
        stroke="rgba(226,232,240,0.40)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Gyri / sulci lines (stylized, like schematic) */}
      <g
        fill="none"
        stroke="rgba(226,232,240,0.36)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M270 176 C298 152 330 150 362 168 C392 186 420 188 450 174" />
        <path d="M248 214 C286 194 322 196 354 218 C386 240 420 244 466 222" />
        <path d="M250 258 C286 238 324 242 356 264 C390 288 430 290 476 268" />
        <path d="M272 302 C306 286 340 292 368 314 C398 338 434 340 472 322" />
        <path d="M316 344 C344 330 372 336 396 356 C420 376 452 378 486 362" />

        <path d="M448 164 C482 146 520 148 552 170 C582 192 612 194 646 176" />
        <path d="M454 214 C490 194 526 196 560 220 C594 244 626 246 662 226" />
        <path d="M448 262 C488 242 526 246 560 270 C594 294 628 296 668 274" />
        <path d="M426 312 C466 292 506 296 538 322 C570 348 606 350 646 332" />
      </g>
    </motion.svg>
  )
}

