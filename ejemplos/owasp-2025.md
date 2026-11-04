# OWASP 2025 - Web Top 10

OWASP Top 10:2025 para aplicaciones web (A01 a A10).

## ¿Qué posición ocupa Broken Access Control en el OWASP Top 10:2025?

- [x] A01
- [ ] A03
- [ ] A05
- [ ] A10

Sigue siendo el riesgo n.º 1. En 2025 absorbió a SSRF.

## Un usuario cambia el id en la URL y ve la factura de otro cliente. ¿Qué categoría es?

- [x] A01:2025 Broken Access Control
- [ ] A04:2025 Cryptographic Failures
- [ ] A06:2025 Insecure Design
- [ ] A09:2025 Security Logging and Alerting Failures

Es un fallo de control de acceso (IDOR): el servidor no comprueba que el recurso pertenezca al usuario.

## ¿Qué categoría cubre cuentas por defecto, puertos abiertos innecesarios y mensajes de error detallados?

- [x] A02:2025 Security Misconfiguration
- [ ] A01:2025 Broken Access Control
- [ ] A07:2025 Authentication Failures
- [ ] A08:2025 Software or Data Integrity Failures

Subió al puesto n.º 2 en 2025 (era el 5.º en 2021).

## ¿Qué medida previene mejor Security Misconfiguration?

- [x] Un proceso de endurecimiento repetible y automatizado, sin funciones ni cuentas innecesarias
- [ ] Cifrar solo las contraseñas en la base de datos
- [ ] Usar siempre un WAF y no tocar nada más
- [ ] Revisar la configuración una vez al año a mano

La configuración debe ser mínima, igual en todos los entornos y verificada automáticamente.

## ¿Qué categoría nueva de 2025 amplía a "Vulnerable and Outdated Components"?

- [x] A03:2025 Software Supply Chain Failures
- [ ] A02:2025 Security Misconfiguration
- [ ] A08:2025 Software or Data Integrity Failures
- [ ] A06:2025 Insecure Design

Incluye dependencias, herramientas de build, repositorios y sistemas de distribución comprometidos.

## Un paquete npm de una dependencia indirecta es reemplazado por una versión maliciosa. ¿Qué categoría es?

- [x] A03:2025 Software Supply Chain Failures
- [ ] A05:2025 Injection
- [ ] A07:2025 Authentication Failures
- [ ] A10:2025 Mishandling of Exceptional Conditions

Es un compromiso de la cadena de suministro de software.

## ¿Qué categoría trata del uso de algoritmos débiles, claves mal gestionadas o datos sensibles sin cifrar?

- [x] A04:2025 Cryptographic Failures
- [ ] A02:2025 Security Misconfiguration
- [ ] A01:2025 Broken Access Control
- [ ] A09:2025 Security Logging and Alerting Failures

Antes se llamaba "Sensitive Data Exposure"; la causa raíz son los fallos criptográficos.

## ¿Cómo se deben almacenar las contraseñas según buenas prácticas?

- [x] Con un hash lento con sal (Argon2, bcrypt, scrypt)
- [ ] Con MD5 sin sal
- [ ] Cifradas con AES y la clave en el código
- [ ] En texto plano en una base protegida

Un hash lento y salado dificulta los ataques de fuerza bruta y de tablas arcoíris.

## ¿Qué ocurre en Injection (A05:2025)?

- [x] Datos no confiables se interpretan como parte de un comando o consulta
- [ ] Se descubren contraseñas por fuerza bruta
- [ ] Se instala una dependencia maliciosa
- [ ] El servidor no registra los eventos

Incluye SQL, NoSQL, comandos del SO, LDAP y XSS.

## ¿Cuál es la defensa principal contra la inyección SQL?

- [x] Consultas parametrizadas (prepared statements)
- [ ] Concatenar y escapar comillas a mano
- [ ] Ocultar los mensajes de error
- [ ] Validar solo en el navegador

Separan el código SQL de los datos, así el dato nunca se ejecuta como código.

## ¿Qué categoría falla cuando el problema está en el diseño y no en la implementación (faltan modelado de amenazas y patrones seguros)?

- [x] A06:2025 Insecure Design
- [ ] A02:2025 Security Misconfiguration
- [ ] A05:2025 Injection
- [ ] A08:2025 Software or Data Integrity Failures

Un diseño inseguro no se arregla con una implementación perfecta; hay que modelar amenazas desde el inicio.

## ¿Qué práctica ayuda a prevenir Insecure Design?

- [x] Modelado de amenazas y patrones de diseño seguros desde el inicio
- [ ] Hacer un pentest solo antes de salir a producción
- [ ] Añadir un firewall delante
- [ ] Minificar el código

Se trata de considerar la seguridad en los requisitos y el diseño.

## ¿Cómo se llama en 2025 la antigua "Identification and Authentication Failures"?

- [x] A07:2025 Authentication Failures
- [ ] A07:2025 Broken Authentication
- [ ] A01:2025 Access Failures
- [ ] A04:2025 Credential Failures

Cubre contraseñas débiles, credential stuffing, sesiones mal gestionadas y falta de MFA.

## ¿Qué medida reduce el credential stuffing?

- [x] Autenticación multifactor y bloqueo o limitación de intentos
- [ ] Pedir cambiar la contraseña cada 30 días
- [ ] Mostrar si el usuario existe o no
- [ ] Guardar la sesión sin expiración

MFA y rate limiting frenan el uso automatizado de credenciales filtradas.

## ¿Qué categoría cubre actualizaciones sin firmar o deserialización de datos no confiables?

- [x] A08:2025 Software or Data Integrity Failures
- [ ] A03:2025 Software Supply Chain Failures
- [ ] A06:2025 Insecure Design
- [ ] A10:2025 Mishandling of Exceptional Conditions

Es no verificar la integridad de código o datos (firmas, checksums) antes de confiar en ellos.

## ¿Qué ayuda a garantizar la integridad del software que se descarga o actualiza?

- [x] Firmas digitales y verificación de checksums
- [ ] Descargarlo siempre por HTTP
- [ ] Confiar en cualquier CDN
- [ ] Desactivar las actualizaciones

Las firmas confirman que el origen es el esperado y que no fue alterado.

## ¿Qué cambia en el nombre de A09:2025 respecto a 2021?

- [x] Se añade "Alerting": Security Logging and Alerting Failures
- [ ] Se elimina "Logging" del nombre
- [ ] Se renombra a Monitoring Failures
- [ ] Se funde con A01

Se subraya que no basta con registrar: hay que alertar y responder a tiempo.

## Un ataque dura meses sin que nadie lo note porque no hay registros ni alertas. ¿Qué categoría es?

- [x] A09:2025 Security Logging and Alerting Failures
- [ ] A02:2025 Security Misconfiguration
- [ ] A08:2025 Software or Data Integrity Failures
- [ ] A03:2025 Software Supply Chain Failures

Sin registros y alertas efectivos, los incidentes no se detectan ni se investigan.

## ¿Cuál es la categoría nueva A10:2025?

- [x] Mishandling of Exceptional Conditions
- [ ] Server-Side Request Forgery
- [ ] Insecure Deserialization
- [ ] Cross-Site Scripting

Trata del manejo incorrecto de errores y condiciones anormales (fail-open, errores sin capturar, información filtrada).

## ¿Qué principio evita que un error deje el sistema abierto al atacante?

- [x] Fail closed: ante un error, denegar por defecto
- [ ] Fail open: ante un error, permitir
- [ ] Mostrar el stack trace al usuario
- [ ] Ignorar la excepción

Un manejo de errores seguro deniega el acceso y no revela detalles internos.

## ¿Dónde quedó SSRF (Server-Side Request Forgery) en el Top 10:2025?

- [x] Se integró en A01 Broken Access Control
- [ ] Sigue como A10 independiente
- [ ] Pasó a A05 Injection
- [ ] Desapareció por completo

En 2021 era A10; en 2025 se agrupa bajo Broken Access Control.

# OWASP 2025 - Top 10 para aplicaciones LLM

OWASP Top 10 for LLM Applications 2025 (LLM01 a LLM10).

## ¿Qué riesgo del Top 10 LLM 2025 ocupa el primer puesto?

- [x] LLM01 Prompt Injection
- [ ] LLM02 Sensitive Information Disclosure
- [ ] LLM06 Excessive Agency
- [ ] LLM10 Unbounded Consumption

Prompt Injection sigue siendo el n.º 1.

## Un texto oculto en una página web hace que el asistente ignore sus instrucciones. ¿Qué riesgo es?

- [x] LLM01 Prompt Injection
- [ ] LLM04 Data and Model Poisoning
- [ ] LLM07 System Prompt Leakage
- [ ] LLM09 Misinformation

Es inyección indirecta: la instrucción maliciosa llega en datos externos que el modelo procesa.

## ¿Qué riesgo cubre que el modelo revele datos personales, secretos o información propietaria?

- [x] LLM02 Sensitive Information Disclosure
- [ ] LLM01 Prompt Injection
- [ ] LLM05 Improper Output Handling
- [ ] LLM08 Vector and Embedding Weaknesses

Se mitiga con sanitización de datos, control de acceso y no entrenar con datos sensibles.

## ¿Qué riesgo abarca modelos, datasets o plugins de terceros comprometidos?

- [x] LLM03 Supply Chain
- [ ] LLM04 Data and Model Poisoning
- [ ] LLM06 Excessive Agency
- [ ] LLM10 Unbounded Consumption

Incluye modelos preentrenados, adaptadores LoRA y datos de origen dudoso.

## ¿Qué ocurre en LLM04 Data and Model Poisoning?

- [x] Se manipulan datos de preentrenamiento, ajuste fino o embeddings para introducir sesgos o puertas traseras
- [ ] Se satura el servicio con peticiones
- [ ] Se roba el prompt del sistema
- [ ] El modelo inventa citas

La manipulación de los datos altera el comportamiento del modelo.

## Una app inserta en el HTML la respuesta del LLM sin sanear y ocurre XSS. ¿Qué riesgo es?

- [x] LLM05 Improper Output Handling
- [ ] LLM01 Prompt Injection
- [ ] LLM02 Sensitive Information Disclosure
- [ ] LLM09 Misinformation

La salida del LLM debe tratarse como entrada no confiable antes de pasarla a otros sistemas.

## ¿Qué riesgo aparece cuando un agente LLM tiene demasiadas funciones, permisos o autonomía?

- [x] LLM06 Excessive Agency
- [ ] LLM05 Improper Output Handling
- [ ] LLM10 Unbounded Consumption
- [ ] LLM03 Supply Chain

Se mitiga con mínimo privilegio, herramientas limitadas y aprobación humana en acciones críticas.

## ¿Qué riesgo es nuevo en 2025 y trata de que las instrucciones internas del sistema puedan exponerse?

- [x] LLM07 System Prompt Leakage
- [ ] LLM02 Sensitive Information Disclosure
- [ ] LLM08 Vector and Embedding Weaknesses
- [ ] LLM09 Misinformation

La clave: no guardar secretos ni controles de seguridad dentro del prompt del sistema.

## ¿Qué riesgo, nuevo en 2025, afecta a los sistemas RAG con bases de datos vectoriales?

- [x] LLM08 Vector and Embedding Weaknesses
- [ ] LLM04 Data and Model Poisoning
- [ ] LLM10 Unbounded Consumption
- [ ] LLM05 Improper Output Handling

Incluye acceso no autorizado a embeddings y fugas entre inquilinos.

## El LLM inventa una librería que no existe y un desarrollador la instala. ¿Qué riesgo es?

- [x] LLM09 Misinformation
- [ ] LLM03 Supply Chain
- [ ] LLM01 Prompt Injection
- [ ] LLM06 Excessive Agency

Las alucinaciones producen información falsa con apariencia creíble.

## ¿Qué riesgo sustituye a "Model Denial of Service" y también abarca costos descontrolados?

- [x] LLM10 Unbounded Consumption
- [ ] LLM04 Data and Model Poisoning
- [ ] LLM06 Excessive Agency
- [ ] LLM03 Supply Chain

Se mitiga con límites de tasa, cuotas y límites de tamaño de entrada.

## ¿Qué defensa ayuda contra LLM10 Unbounded Consumption?

- [x] Limitar tasa, tamaño de entrada y cuotas por usuario
- [ ] Aumentar el contexto máximo
- [ ] Permitir peticiones ilimitadas a usuarios registrados
- [ ] Desactivar los registros

Controla el abuso y el costo de inferencia.

# OWASP 2025 - Non-Human Identities Top 10

OWASP Non-Human Identities (NHI) Top 10 2025: identidades de máquinas, cuentas de servicio, tokens y claves de API.

## ¿Qué es una identidad no humana (NHI)?

- [x] Una identidad de máquina o servicio: cuenta de servicio, token, clave de API, certificado
- [ ] Un usuario administrador sin MFA
- [ ] Un bot de chat
- [ ] Un empleado externo

Las NHI autentican a aplicaciones, scripts y servicios entre sí.

## NHI1:2025 trata de cuentas o credenciales de servicio que siguen activas cuando ya no se necesitan. ¿Cómo se llama?

- [x] Improper Offboarding
- [ ] Secret Leakage
- [ ] NHI Reuse
- [ ] Long-Lived Secrets

Se mitiga desactivando y revocando las NHI al retirar una app o a su propietario.

## NHI2:2025 es una clave de API subida por error a un repositorio público. ¿Cómo se llama?

- [x] Secret Leakage
- [ ] Improper Offboarding
- [ ] Insecure Authentication
- [ ] Environment Isolation

Los secretos expuestos en código, logs o chats son uno de los vectores más comunes.

## NHI3:2025 se refiere a integraciones de terceros (extensiones, apps de IDE, SaaS) con acceso a tus recursos. ¿Cómo se llama?

- [x] Vulnerable Third-Party NHI
- [ ] Overprivileged NHI
- [ ] NHI Reuse
- [ ] Human Use of NHI

Una integración comprometida hereda los permisos de la NHI que le diste.

## NHI4:2025 consiste en usar métodos de autenticación obsoletos o inseguros en servicios o APIs. ¿Cómo se llama?

- [x] Insecure Authentication
- [ ] Secret Leakage
- [ ] Long-Lived Secrets
- [ ] Improper Offboarding

Ej.: autenticación básica o flujos OAuth antiguos en lugar de métodos modernos.

## NHI5:2025 es una cuenta de servicio con más permisos de los que necesita. ¿Cómo se llama?

- [x] Overprivileged NHI
- [ ] Improper Offboarding
- [ ] Vulnerable Third-Party NHI
- [ ] Environment Isolation

Aplicar el principio de mínimo privilegio reduce el impacto de un compromiso.

## NHI6:2025 trata de secretos y configuraciones inseguras en pipelines CI/CD y proveedores cloud. ¿Cómo se llama?

- [x] Insecure Cloud Deployment Configurations
- [ ] Secret Leakage
- [ ] NHI Reuse
- [ ] Long-Lived Secrets

Los pipelines deben usar federación OIDC en vez de credenciales estáticas.

## NHI7:2025 son tokens o claves que nunca caducan ni se rotan. ¿Cómo se llama?

- [x] Long-Lived Secrets
- [ ] Secret Leakage
- [ ] Insecure Authentication
- [ ] Improper Offboarding

Se mitiga con credenciales de corta duración y rotación automática.

## NHI8:2025 habla de usar la misma NHI en entornos de desarrollo, pruebas y producción. ¿Cómo se llama?

- [x] Environment Isolation
- [ ] NHI Reuse
- [ ] Human Use of NHI
- [ ] Vulnerable Third-Party NHI

Cada entorno debe tener sus propias identidades para que un compromiso no se propague.

## NHI9:2025 es reutilizar la misma NHI en varias aplicaciones o servicios. ¿Cómo se llama?

- [x] NHI Reuse
- [ ] Environment Isolation
- [ ] Overprivileged NHI
- [ ] Long-Lived Secrets

Dificulta el rastreo y amplía el radio de impacto si se compromete.

## NHI10:2025 es cuando una persona usa una cuenta de servicio para tareas manuales. ¿Cómo se llama?

- [x] Human Use of NHI
- [ ] NHI Reuse
- [ ] Insecure Authentication
- [ ] Environment Isolation

Se pierde la trazabilidad: las acciones no se pueden atribuir a una persona concreta.

# OWASP 2025 - Agentic Applications Top 10

OWASP Top 10 for Agentic Applications (publicado en diciembre de 2025, ASI01 a ASI10).

## ASI01: el atacante redirige los objetivos o el plan de un agente mediante contenido manipulado. ¿Cómo se llama?

- [x] Agent Goal Hijack
- [ ] Rogue Agents
- [ ] Cascading Failures
- [ ] Tool Misuse and Exploitation

El agente cambia de objetivo por instrucciones ocultas en correos, documentos o páginas.

## ASI02: un agente usa una herramienta legítima de forma insegura o destructiva. ¿Cómo se llama?

- [x] Tool Misuse and Exploitation
- [ ] Agent Goal Hijack
- [ ] Unexpected Code Execution
- [ ] Identity and Privilege Abuse

Las herramientas con permisos amplios pueden ser mal usadas por un agente manipulado.

## ASI03: un agente hereda o escala credenciales y permisos que no le corresponden. ¿Cómo se llama?

- [x] Identity and Privilege Abuse
- [ ] Tool Misuse and Exploitation
- [ ] Rogue Agents
- [ ] Memory and Context Poisoning

Se mitiga con identidades propias del agente y permisos de corta duración.

## ASI04: herramientas, plugins, servidores MCP o modelos de terceros comprometidos que usa el agente. ¿Cómo se llama?

- [x] Agentic Supply Chain Vulnerabilities
- [ ] Insecure Inter-Agent Communication
- [ ] Rogue Agents
- [ ] Human-Agent Trust Exploitation

Los componentes se cargan en tiempo de ejecución, lo que amplía la superficie de ataque.

## ASI05: un agente genera o ejecuta código que acaba corriendo comandos no deseados. ¿Cómo se llama?

- [x] Unexpected Code Execution (RCE)
- [ ] Tool Misuse and Exploitation
- [ ] Cascading Failures
- [ ] Agent Goal Hijack

Se mitiga ejecutando el código generado en sandboxes aisladas.

## ASI06: se contamina la memoria o el contexto persistente del agente para influir en decisiones futuras. ¿Cómo se llama?

- [x] Memory and Context Poisoning
- [ ] Agent Goal Hijack
- [ ] Insecure Inter-Agent Communication
- [ ] Rogue Agents

El efecto persiste entre sesiones porque el agente recuerda la información envenenada.

## ASI07: mensajes entre agentes sin autenticación, cifrado o validación. ¿Cómo se llama?

- [x] Insecure Inter-Agent Communication
- [ ] Cascading Failures
- [ ] Rogue Agents
- [ ] Agentic Supply Chain Vulnerabilities

Un agente puede suplantar a otro o manipular los mensajes en tránsito.

## ASI08: un fallo pequeño de un agente se propaga a otros y amplifica el daño. ¿Cómo se llama?

- [x] Cascading Failures
- [ ] Rogue Agents
- [ ] Insecure Inter-Agent Communication
- [ ] Unexpected Code Execution

La autonomía y la conexión entre agentes hacen que los errores se propaguen rápido.

## ASI09: el agente usa su aspecto convincente para engañar a una persona y que apruebe algo dañino. ¿Cómo se llama?

- [x] Human-Agent Trust Exploitation
- [ ] Agent Goal Hijack
- [ ] Identity and Privilege Abuse
- [ ] Rogue Agents

Las personas tienden a confiar en la fluidez y autoridad aparente del agente.

## ASI10: un agente que se desvía de su comportamiento previsto y actúa de forma dañina por su cuenta. ¿Cómo se llama?

- [x] Rogue Agents
- [ ] Agent Goal Hijack
- [ ] Cascading Failures
- [ ] Tool Misuse and Exploitation

Agentes comprometidos o desalineados que siguen funcionando fuera de lo previsto.
