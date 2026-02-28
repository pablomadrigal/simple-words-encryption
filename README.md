# Words Autocomplete + Mechanical Encryptor

Encriptador mecánico que mapea palabras BIP-39 inglés ↔ español con offset circular y autocompletado.

## Files

- `encryptor.html` – Encryptor with autocomplete (HTML + vanilla JS). Wordlists embedded; works offline (file://).
- `embed-wordlists.js` – Optional: run to refresh embedded BIP-39 lists from bitcoin/bips.

## Usage

Open `encryptor.html` directly in a browser (file://). No server needed; wordlists are embedded.

- **Encrypt**: inglés → español. Escribe palabras BIP-39 en inglés, aplica offset (0–2047).
- **Decrypt**: español → inglés. Mismo offset en sentido inverso.
- **Autocomplete**: prefijo o contiene. Selecciona con clic o Enter.

### Example

- Decrypt: `casa` con offset `4` → palabra en posición (índice_casa + 4) en BIP-39 inglés.
- Encrypt: palabra en inglés con offset `4` → `casa` (si coincide el mapeo inverso).
