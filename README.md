# Quantic Store

Loja virtual de mods para FiveM - cabelos, roupas e acessorios exclusivos.

## Como usar as imagens

Coloque suas imagens nas pastas correspondentes dentro de `public/`:

```
public/
├── products/           # Imagens dos produtos na loja
│   ├── cabelo-dreamcore.jpg
│   ├── top-dark-lace.jpg
│   └── ...
├── ingame/            # Screenshots dentro do jogo
│   ├── cabelo-dreamcore-1.jpg
│   └── ...
├── collections/       # Imagens das colecoes
│   ├── dark-cute.jpg
│   └── ...
├── hero/              # Imagens do slider principal
│   ├── slide1.jpg
│   ├── slide2.jpg
│   └── slide3.jpg
└── avatars/           # Avatares dos reviews
    ├── avatar1.jpg
    └── ...
```

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build para producao

```bash
npm run build
```

## Deploy no Vercel

1. Faca push deste repositorio no GitHub
2. Conecte o repositorio na Vercel
3. O deploy sera automatico a cada push

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide Icons
