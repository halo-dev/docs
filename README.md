# The open-source repo for [docs.halo.run](https://docs.halo.run)

This website is built using [Rspress](https://rspress.rs/), a modern static website generator.

### Installation

```bash
pnpm install
```

> If you don’t have pnpm installed, you can install it with the following command:

```bash
npm install -g pnpm@12.4.2
```

### Local Development

```bash
pnpm dev
```

This command starts a local development server. Most changes are reflected live without restarting it.

### Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Contributing

The `main` branch deploys to production continuously. Submit documentation for released Halo versions as a PR against `main`, or push directly to `main` if you have write access. Submit documentation for unreleased Halo versions to `dev`.

Before requesting review, run `pnpm check` and `pnpm build`, and inspect the affected pages locally.

### Maintenance

After Halo releases a new version, maintainers create a `release-xxx` branch from `main` to archive the previous documentation, then merge `dev` into `main`.
