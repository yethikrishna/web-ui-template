# create-varsha (Haskell)

A Haskell wrapper for the `create-varsha` CLI tool — scaffolds a new varsha website project (a premium Astro + Starlight starter template by myndlabs).

## Prerequisites

- **Node.js** >= 18.17.0 ([https://nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **GHC** >= 8.10 (for building from source)

## Installation

### From Hackage

```bash
cabal install create-varsha
```

### From source

```bash
git clone https://github.com/yethikrishna/web-ui-template.git
cd web-ui-template/wrappers/haskell
cabal install
```

## Usage

```bash
create-varsha my-site
```

This will:
1. Check for Node.js and npm
2. Delegate to `npx create-varsha` for scaffolding
3. Install dependencies automatically

### Options

```
create-varsha [project-name] [options]

Options:
  -h, --help      Show help
  -v, --version   Show version
```

## Publishing to Hackage

```bash
cabal sdist
cabal upload dist-newstyle/sdist/create-varsha-1.0.0.tar.gz
```

## License

MIT — see [LICENSE](LICENSE)

## Repository

[https://github.com/yethikrishna/web-ui-template](https://github.com/yethikrishna/web-ui-template)
