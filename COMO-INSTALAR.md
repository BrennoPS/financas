# Usar no celular (iPhone e Android) — pelo Wi-Fi, sem publicar nada

O app roda no **PC** e você acessa pelo **celular no mesmo Wi-Fi**. Seus dados
ficam guardados no PC (arquivo `finance.db`), então nada vai pra internet.

> Funciona com o **PC ligado** e celular no **mesmo Wi-Fi**. Não abre na rua nem
> com o PC desligado (pra isso seria preciso publicar — veja o fim).

---

## Passo 1 — Ligar o app no PC
Dê dois cliques em **`publish\Iniciar.bat`**.
Vai abrir uma janela preta mostrando um endereço assim:

```
Celular: http://192.168.0.113:5000   (mesmo Wi-Fi)
```

Anote esse endereço (o número pode ser diferente no seu caso).

## Passo 2A — iPhone (iOS)
1. Conecte o iPhone no **mesmo Wi-Fi** do PC.
2. Abra o **Safari** e digite o endereço (ex.: `http://192.168.0.113:5000`).
3. O app abre. Para criar o ícone: toque em **Compartilhar** (quadradinho com seta
   pra cima) → **"Adicionar à Tela de Início"** → **Adicionar**.
4. Agora é só tocar no ícone **Finanças** (com o PC ligado) que ele abre.

## Passo 2B — Android
1. Conecte o celular no **mesmo Wi-Fi** do PC.
2. Abra o **Chrome** e digite o endereço.
3. Menu **⋮** → **"Adicionar à tela inicial"**.

---

## Bom saber
- Seus 3 fixos (Paramount, Claro, Internet) já estão cadastrados. Toque em
  **"Entrou"** para informar a receita do mês e ver o **"Sobrou"**.
- **Backup:** seus dados são o arquivo **`publish\finance.db`**. Copie ele para um
  pendrive/nuvem de vez em quando e está salvo.
- **Se o endereço parar de funcionar:** o roteador pode ter trocado o IP do PC.
  Abra de novo o `Iniciar.bat` e veja o novo endereço na janela preta.
  (Dá pra fixar o IP do PC no roteador pra nunca mudar — me peça que eu te ajudo.)

## E se um dia quiser usar SEM o PC (offline, na rua)?
Aí sim seria preciso **publicar** o app uma vez (grátis) num endereço HTTPS — só o
app vazio vai pra internet, seus dados continuam só no aparelho. É só me avisar que
eu preparo.
