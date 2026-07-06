# Worklog

Bitácora de trabajo: qué se hizo en cada sesión, decisiones del día, y qué quedó pendiente.
Sirve para retomar el proyecto sin perder el hilo entre sesiones.

---

## Cómo se organiza

**Por fecha, en subcarpetas de mes, con el tema en el nombre del archivo.**

```
worklog/
├── README.md                                  ← este archivo
├── 2026-07/                                   ← subcarpeta por mes (YYYY-MM)
│   ├── 2026-07-05-diseno-y-documentacion.md
│   └── 2026-07-XX-<tema>.md
└── 2026-08/
    └── ...
```

- **Nombre de archivo:** `YYYY-MM-DD-<tema-en-kebab-case>.md`
  - Ej: `2026-07-12-scaffold-frontend.md`
- Si en un mismo día hay dos temas bien distintos, se pueden hacer dos archivos con el mismo
  día y distinto tema.

> ¿Por qué así? El worklog es cronológico por naturaleza (querés ver "qué hicimos la última
> vez"), pero el tema en el nombre lo hace buscable ("¿dónde tocamos el mapa?").

---

## Plantilla de entrada

Copiar esto al crear una entrada nueva:

```markdown
# YYYY-MM-DD — <Tema>

## Qué se hizo
- ...

## Decisiones tomadas
- ... (si es importante, también va a `docs/decisiones.md`)

## Problemas / pendientes
- ...

## Próximo paso
- ...
```
