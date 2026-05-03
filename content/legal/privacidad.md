# Política de Privacidad — Niela

**Última actualización:** 3 de mayo de 2026
**Cumple con:** Reglamento (UE) 2016/679 (GDPR), Codice Privacy italiano (D.Lgs. 196/2003 modif. 101/2018)

## 1. Responsable del tratamiento

**Yunior Rivera**, persona física residente en Italia.
Email para asuntos de privacidad: appniela@gmail.com

Como app individual sin DPO obligatorio (no procesamos datos a gran escala bajo Art. 37 GDPR), el responsable directo es el operador de Niela.

## 2. Qué datos recopilamos

### 2.1 Datos que tú nos das
- **Cuenta:** email, contraseña (hasheada), nombre opcional.
- **Onboarding:** tradiciones espirituales preferidas (zen, sufí, etc.), problema principal en texto libre, duración preferida, tono, notas culturales opcionales.
- **Uso:** descripciones de problemas que escribís para generar meditaciones, entradas de journaling (mood + notas), favoritos guardados.
- **Pagos:** procesados por Stripe/Apple/Google. **Nosotros no vemos ni almacenamos tu tarjeta**, solo recibimos confirmación de pago y un ID de cliente.

### 2.2 Datos que recopilamos automáticamente
- **Técnicos:** dirección IP (anonimizada para análisis), tipo de dispositivo, sistema operativo, versión de la app.
- **De uso:** sesiones iniciadas, meditaciones escuchadas, duración de uso (sin contenido).
- **Errores:** trazas técnicas de fallos vía Sentry (sin contenido personal asociado).

### 2.3 Datos que NO recopilamos
- No accedemos a tus contactos, calendario, fotos, ubicación precisa, ni biometría.
- No usamos cookies de terceros para publicidad.
- No vendemos tus datos a nadie. Nunca.

## 3. Categorías especiales de datos

Tu descripción de "problema principal", journaling, y mood pueden contener información sobre tu **bienestar emocional o estado mental**. Bajo Art. 9 GDPR, estos pueden considerarse "categorías especiales" si revelan condiciones de salud.

**Base legal del tratamiento:** consentimiento explícito (Art. 9.2.a GDPR), que vos otorgás al completar el onboarding y usar las funciones IA.

**Garantías adicionales:**
- Tu descripción se usa SOLO para generar tu meditación personalizada.
- Las trazas en Sentry NO incluyen el texto de tu problema (lo bloqueamos explícitamente).
- Solo Yunior Rivera tiene acceso administrativo a la base de datos.
- Las consultas a la base están protegidas con Row Level Security: cada query solo ve los datos del usuario autenticado.

## 4. Para qué usamos tus datos (finalidades y bases legales)

| Finalidad | Base legal GDPR |
|---|---|
| Crear y mantener tu cuenta | Ejecución del contrato (Art. 6.1.b) |
| Generar meditaciones IA personalizadas | Consentimiento explícito (Art. 9.2.a) |
| Procesar tu suscripción | Ejecución del contrato (Art. 6.1.b) |
| Detectar crisis de salud mental y mostrar recursos de emergencia | Interés vital (Art. 6.1.d) |
| Mejorar el servicio (analytics agregados) | Interés legítimo (Art. 6.1.f) |
| Cumplir obligaciones legales (impuestos, requerimientos judiciales) | Obligación legal (Art. 6.1.c) |

## 5. Con quién compartimos tus datos

Solo con proveedores estrictamente necesarios, todos con acuerdos de procesamiento de datos (DPA):

| Proveedor | Para qué | Ubicación |
|---|---|---|
| **Railway** | Hosting de servidor y base de datos | EE.UU. (DPA + Cláusulas Contractuales Tipo) |
| **Anthropic** | Generación de meditaciones IA | EE.UU. (DPA + SCCs) |
| **ElevenLabs** | Síntesis de voz para audio | EE.UU. (DPA + SCCs) |
| **Stripe** | Procesamiento de pagos | Irlanda (UE) |
| **Resend** | Email transaccional (waitlist, confirmaciones) | EE.UU. (DPA + SCCs) |
| **Sentry** | Monitoreo de errores | EE.UU. (DPA + SCCs, sin datos personales asociados) |
| **Vercel** | Hosting de la web niela.app | EE.UU. (DPA + SCCs) |

**Transferencias internacionales:** los proveedores en EE.UU. operan bajo Cláusulas Contractuales Tipo de la UE (SCCs) aprobadas por la Comisión Europea, que garantizan protección equivalente a GDPR.

**Lo que enviamos a Anthropic/ElevenLabs:** tu descripción de problema, tradición elegida, duración. **No enviamos tu email, nombre, ni identificadores que te identifiquen personalmente.**

## 6. Cuánto tiempo guardamos tus datos

| Tipo de dato | Retención |
|---|---|
| Cuenta activa | Mientras tu cuenta exista |
| Cuenta cerrada | 30 días tras la baja, luego eliminación completa |
| Datos de pago (facturas) | 10 años (obligación fiscal italiana) |
| Logs técnicos | 90 días |
| Backups encriptados | Hasta 30 días |
| Email de waitlist (sin cuenta) | Hasta que solicites baja o lancemos producto |

## 7. Tus derechos GDPR

Tenés derecho a:

- **Acceso (Art. 15):** pedir copia de todos tus datos. Te la enviamos en JSON dentro de 30 días.
- **Rectificación (Art. 16):** corregir datos inexactos.
- **Borrado / "derecho al olvido" (Art. 17):** eliminar tu cuenta y todos tus datos personales (excepto los que debemos conservar por ley fiscal).
- **Limitación (Art. 18):** suspender el tratamiento de tus datos.
- **Portabilidad (Art. 20):** recibir tus datos en formato JSON estructurado para llevarlos a otro servicio.
- **Oposición (Art. 21):** oponerte al tratamiento basado en interés legítimo.
- **Retirar consentimiento (Art. 7.3):** en cualquier momento, sin afectar la legalidad del tratamiento previo.
- **Reclamar ante autoridad de control:** Garante per la Protezione dei Dati Personali (Italia, https://www.gpdp.it/) o tu autoridad nacional.

**Cómo ejercerlos:** envianos email a appniela@gmail.com con tu solicitud. Respondemos dentro de 30 días (extensible a 60 si la solicitud es compleja, te avisamos).

Dentro de la app: la opción "Eliminar cuenta" está en Configuración → Cuenta → Eliminar todos mis datos.

## 8. Seguridad

Implementamos medidas técnicas y organizativas:

- **Cifrado en tránsito:** todas las conexiones usan TLS 1.3.
- **Cifrado en reposo:** la base de datos está cifrada en Railway.
- **Contraseñas:** hasheadas con bcrypt (cost factor 12), nunca almacenadas en texto plano.
- **Autenticación:** tokens JWT firmados, expiración configurada.
- **Aislamiento de datos:** Row Level Security en PostgreSQL — cada usuario solo ve sus propios datos a nivel de base de datos.
- **Monitoreo:** alertas automáticas de errores y accesos sospechosos vía Sentry.
- **Rate limiting:** protección contra fuerza bruta en login (3 intentos/min, escalado a 6/10min, 10/15min).
- **Backups:** snapshots cifrados con retención limitada.
- **Acceso administrativo:** solo el operador (Yunior Rivera) tiene credenciales, con autenticación reforzada.

En caso de brecha de seguridad que afecte datos personales, notificaremos a la autoridad de control (Garante) dentro de 72 horas y a los usuarios afectados sin demora indebida (Art. 33-34 GDPR).

## 9. Menores

Niela está dirigida a personas mayores de **16 años** (edad mínima de consentimiento digital en la UE). No recopilamos conscientemente datos de menores de 16 años.

Si descubrimos que un usuario es menor de 16 sin consentimiento parental verificable, eliminaremos su cuenta y datos. Si sos padre/madre/tutor y creés que tu hijo/a tiene cuenta, contactanos a appniela@gmail.com.

## 10. Cookies y tecnologías similares

### Web (niela.app)
- **Cookies estrictamente necesarias:** sesión y autenticación. No requieren consentimiento.
- **Cookies analíticas:** podemos usar Plausible u otra herramienta privacy-friendly que NO requiere consentimiento (sin tracking individual).
- **NO usamos cookies de publicidad o tracking de terceros.**

### App móvil
- Almacenamiento local seguro (Keychain/Keystore) para tu sesión.
- No usamos identificadores publicitarios (IDFA/AAID).

Detalles completos en nuestra [Política de Cookies](#cookies).

## 11. Cambios a esta política

Podemos actualizar esta política. Cambios sustanciales se notifican por email y dentro de la app con 30 días de antelación. La fecha de "Última actualización" arriba refleja la versión vigente.

## 12. Contacto

**Para todo lo relativo a privacidad:** appniela@gmail.com

**Autoridad de control italiana:**
Garante per la Protezione dei Dati Personali
Piazza Venezia 11, 00187 Roma
https://www.gpdp.it/
Email: garante@gpdp.it
