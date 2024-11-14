# Attention the project is still in the development.

### To start backend locally.

```bash
cd backend
uv sync
uv run .\app\initial_data.py # Create db and superuser
uv run -m app # Start app
```


### To start fronted locally.

```bash
cd .\next-front\
bun install
bun run dev
```