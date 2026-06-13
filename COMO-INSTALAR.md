# Controle Financeiro — instalar no celular (offline, sem PC)

**Link do app:** https://brennops.github.io/financas/

O app abre **offline, em qualquer lugar** (Wi-Fi, dados móveis, modo avião) depois de
instalado. Seus dados ficam **só no seu celular** — nada vai pra internet.

---

## iPhone (iOS) — instalar
1. Abra o link **no Safari**: https://brennops.github.io/financas/
2. Toque no botão **Compartilhar** (quadradinho com a seta pra cima, embaixo).
3. Role e toque em **"Adicionar à Tela de Início"**.
4. Toque em **Adicionar** (canto superior direito).
5. Pronto! Abra pelo ícone **Finanças**. A partir daí funciona **sem internet e sem PC**.

> Tem que ser o **Safari** (no iPhone só ele instala PWA). Faça isso 1x com internet;
> depois abre offline pra sempre.

## Android — instalar
1. Abra o link **no Chrome**: https://brennops.github.io/financas/
2. Aparece **"Instalar app"** (ou menu **⋮** → **"Instalar app"**).
3. Confirme. Ícone **Finanças** na tela inicial, abre offline.

---

## Usando
- Seus 3 fixos (Paramount, Claro, Internet) já vêm cadastrados.
- Toque em **"Entrou"** para informar a receita do mês → o app mostra o **"Sobrou"**.
- Botão **+** adiciona gastos (marque "fixo" se repete todo mês).
- Aba **Histórico**: gastos por ano, mês e dia.

## Backup (importante!)
Como os dados ficam só no celular, faça backup de vez em quando:
- Aba **Ajustes** (engrenagem) → **Exportar** → salva um arquivo. Guarde no e-mail/nuvem.
- Trocou de celular? Instale o app no novo e use **Ajustes → Importar** com esse arquivo.

## Atualizações
Se eu melhorar o app depois, o link é o mesmo e ele **se atualiza sozinho** na próxima
vez que abrir com internet.

---

### Detalhes técnicos (pra referência)
- Repositório: https://github.com/BrennoPS/financas (público — só o código, sem dados).
- Hospedagem: GitHub Pages (grátis). Site servido de `main` / pasta `docs`.
- Para reconstruir após mudar o código: `cd client && npm run build` (gera `docs/`),
  depois `git add -A && git commit && git push`.
