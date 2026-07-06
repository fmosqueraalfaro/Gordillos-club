# Protocolo de trabajo

Cómo trabajamos juntos (el usuario + Claude) en este proyecto. El objetivo es avanzar
prolijo, sin sorpresas y sin trabarnos.

---

## Cómo debe comportarse Claude en este repo

1. **Documentar sobre la marcha.** Toda decisión importante se registra en `docs/`
   (especialmente en `docs/decisiones.md`). No dejamos conocimiento solo en el chat.
2. **Preguntar antes de decisiones que no se pueden deshacer fácil** o que cambian el rumbo:
   modelo de datos, servicios/costos, borrar cosas, cambios de stack. Para lo demás,
   proponer un default razonable y avanzar.
3. **Respetar la "regla de oro" de costos.** Antes de sumar cualquier servicio, verificar
   que el uso de dos personas quede dentro del free tier, y documentar las salvaguardas
   (topes/alertas). Nada que pueda generar un cobro sorpresa.
4. **Un cambio a la vez, explicado.** Cambios chicos y entendibles antes que saltos grandes.
   Explicar el *por qué*, no solo el *qué*.
5. **Español para hablar y documentar; inglés para el código.**
6. **No sobre-construir.** Respetar el alcance de `docs/contexto.md`. Si aparece una idea
   nueva fuera de alcance, anotarla y preguntar, no implementarla de una.
7. **Mantener la doc viva.** Si algo cambia (stack, estado, decisiones), actualizar
   `CLAUDE.md` y el doc correspondiente en el mismo momento.

---

## Flujo para agregar una feature

1. **Entender:** ¿qué problema resuelve? ¿está dentro del alcance? ¿aporta al norte?
2. **Diseñar:** si toca datos o servicios, pensar el modelo/impacto y anotarlo.
3. **Decidir:** si hay una elección relevante, registrarla en `docs/decisiones.md`.
4. **Construir:** cambios chicos, código claro, siguiendo las convenciones.
5. **Probar:** verificar que funciona de verdad (no solo que compila) — sobre todo el flujo
   en el celular.
6. **Documentar:** actualizar estado en `CLAUDE.md` / roadmap si corresponde.

---

## Definición de "hecho" (Definition of Done)

Una tarea está *hecha* cuando:
- [ ] Funciona en el flujo real (probado, no solo teórico).
- [ ] Se ve y se usa bien en **mobile**.
- [ ] No rompe nada de lo que ya andaba.
- [ ] No introduce secretos en el repo (keys en `.env`).
- [ ] Si tomó una decisión relevante, quedó registrada.
- [ ] El estado en `CLAUDE.md` / `roadmap.md` está actualizado.

---

## Convenciones de código

- **Lenguaje:** TypeScript en todo el frontend.
- **Nombres:** en inglés, descriptivos. Componentes en `PascalCase`, variables/función en
  `camelCase`, archivos de componentes en `PascalCase.tsx`.
- **Estructura:** por definir en el scaffold (Fase 1). Preferencia: por feature/dominio.
- **Estilos:** Tailwind + shadcn/ui. Evitar CSS suelto salvo que sea necesario.
- **Secretos:** siempre en variables de entorno (`VITE_...`), nunca hardcodeados.
- **Comentarios:** los justos. Explicar el *por qué* de algo no obvio, no el *qué*.

---

## Git (a definir al iniciar el repo)

- Rama principal: `main`.
- Trabajar en ramas por feature y mergear (o commits directos en `main` si preferís simple,
  al ser proyecto personal — a confirmar).
- Mensajes de commit claros, en presente. Ej: `add restaurant map view`.
- **Los commits NO llevan trailer `Co-Authored-By`** (preferencia del usuario, desde
  2026-07-05). Mensajes limpios, sin firma de co-autoría de la IA.
- `.gitignore` desde el arranque: `node_modules`, `.env`, build outputs.

> Nota: el proyecto todavía NO es un repo git. Se inicializa en Fase 1.

---

## Ritmo de trabajo

- Avanzamos por fases (ver `docs/roadmap.md`), de a pasos concretos.
- Al terminar un paso, dejamos claro **qué sigue**.
- Si algo depende de una acción del usuario (instalar Node, crear cuenta en Supabase, cargar
  una API key), Claude lo indica claramente y espera.
