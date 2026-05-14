'use client';

import { useRef, useState } from 'react';

function createRandom(seed: number) {
    let s = seed;

    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface PhotoData {
    id: number;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    zIndex: number;
}

const SIZES = [
    { w: 120, h: 90  },
    { w: 155, h: 115 },
    { w: 190, h: 140 },
    { w: 105, h: 135 },
    { w: 135, h: 180 },
    { w: 95,  h: 70  },
    { w: 240, h: 175 },
    { w: 205, h: 145 },
    { w: 110, h: 150 },
    { w: 175, h: 120 },
];

function generatePhotos(count: number, seed: number): PhotoData[] {
    const rand = createRandom(seed);
    const photos: PhotoData[] = [];

    const canvasW = 100;
    const rowH = 300;
    const totalRows = Math.ceil(count / 6);
    const minDistX = 14;
    const minDistY = 80;
    const maxTries = 30;

    for (let i = 0; i < count; i++) {
        const size = SIZES[Math.floor(rand() * SIZES.length)];
        const row = Math.floor(i / 6);

        let x = 0, y = 0, placed = false;

        for (let attempt = 0; attempt < maxTries; attempt++) {
            const candidateX = 4 + rand() * (canvasW - 14);
            const candidateY = row * rowH + rand() * (rowH - size.h - 20) + 60;

            const tooClose = photos.some((p) => {
                const dx = Math.abs(p.x - candidateX);
                const dy = Math.abs(p.y - candidateY);
                return dx < minDistX && dy < minDistY;
            });

            if (!tooClose) {
                x = candidateX;
                y = candidateY;
                placed = true;
                break;
            }
        }

        if (!placed) {
            x = 4 + rand() * (canvasW - 14);
            y = row * rowH + rand() * rowH + 60;
        }

        photos.push({
            id: i,
            src: `https://picsum.photos/seed/smkpi${i + 10}/${size.w * 2}/${size.h * 2}`,
            x,
            y,
            width: size.w,
            height: size.h,
            rotate: (rand() - 0.5) * 10,
            zIndex: Math.floor(rand() * 10) + 1,
        });

        void rand();
    }

    return photos;
}

const TOTAL_PHOTOS = 1000;

const photos = generatePhotos(TOTAL_PHOTOS, 42);

const containerHeight =
    Math.max(...photos.map((p) => p.y + p.height)) + 200;

export default function GallerySection() {

const [selected, setSelected] = useState<PhotoData | null>(null);

    return (
        <div
            className="relative w-full z-2"
            style={{ height: containerHeight }}
        >
            <div className="absolute top-[42vh] left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
                <p className="text-[11px] tracking-[0.35em] uppercase text-ink/45 mb-3">
                    memories · moments · stories
                </p>

                <h1 className="text-[clamp(34px,5vw,82px)] leading-none font-black tracking-[-0.06em] text-ink">
                    PPLG1
                </h1>

                <p className="text-[13px] italic text-ink/55 mt-3">
                    archive of beautiful chaos
                </p>
            </div>

            {photos.map((photo, i) => (
                <div
                    key={photo.id}
                    className="absolute"
                    style={{
                        left: `${photo.x}%`,
                        top: photo.y,
                        zIndex: photo.zIndex,
                    }}
                >
                    <div
                        className="photo-card bg-white p-[5px] shadow-md cursor-pointer"
                        onClick={() => setSelected(photo)}
                        style={{
                            width: photo.width,
                            height: photo.height,
                        }}
                    >
                        <img
                            src={photo.src}
                            alt={`Gallery photo ${photo.id + 1}`}
                            loading="lazy"
                            className="block w-full h-full object-cover pointer-events-none select-none"
                            draggable={false}
                        />
                    </div>
                </div>
            ))}

{selected && (
    <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
        onClick={() => setSelected(null)}
    >
        <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
        >
            <img
                src={`https://picsum.photos/seed/smkpi${selected.id + 10}/1200/900`}
                alt=""
                className="
                    block
                    w-auto
                    h-auto
                    max-w-[50vw]
                    max-h-[55vh]
                    object-contain
                    rounded-sm
                    shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                "
            />
<button
    onClick={() => setSelected(null)}
    className="
        absolute
        -top-7
        left-1/2
        -translate-x-1/2
        rotate-[-3deg]
        flex
        items-center
        justify-center
    "
>
    <div
        className="
            w-16
            h-12
            bg-[#3b82f6]
            text-white
            text-[10px]
            font-bold
            tracking-[0.35em]
            flex
            items-center
            justify-center
            shadow-sm
            opacity-90
        "
        style={{
            clipPath:
                'polygon(4% 0%, 96% 0%, 100% 18%, 97% 100%, 3% 100%, 0% 20%)',
        }}
    >
        CLOSE
    </div>
</button>
        </div>
    </div>
)}
        </div>
    );
}