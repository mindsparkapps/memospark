# Hardening

Endurecimiento de sistemas: reducir la superficie de ataque de sistemas operativos, servidores, redes, contenedores y aplicaciones.

## ¿Qué es el hardening (endurecimiento) de un sistema?

- [x] Reducir su superficie de ataque eliminando funciones innecesarias y configurándolo de forma segura
- [ ] Instalar el mayor número posible de herramientas de seguridad
- [ ] Hacer copias de seguridad periódicas
- [ ] Cifrar el disco y no tocar nada más

Menos servicios, menos cuentas y menos permisos significan menos puntos por donde atacar.

## ¿Qué dice el principio de mínimo privilegio?

- [x] Cada usuario o proceso debe tener solo los permisos necesarios para su tarea
- [ ] Los administradores deben tener todos los permisos siempre
- [ ] Todos los usuarios comparten la misma cuenta
- [ ] Los servicios deben ejecutarse como root

Limita el daño que puede causar una cuenta comprometida.

## ¿Qué es la superficie de ataque?

- [x] El conjunto de puntos por los que un atacante puede intentar entrar o extraer datos
- [ ] El tamaño del centro de datos
- [ ] El número de usuarios de la empresa
- [ ] La cantidad de datos cifrados

Incluye puertos abiertos, servicios, cuentas, interfaces y software instalado.

## ¿Qué son los CIS Benchmarks?

- [x] Guías de configuración segura, consensuadas, para sistemas, aplicaciones y servicios en la nube
- [ ] Pruebas de rendimiento de hardware
- [ ] Un listado de vulnerabilidades conocidas
- [ ] Un certificado para empresas

Publicadas por el Center for Internet Security, definen perfiles de endurecimiento (nivel 1 y nivel 2).

## ¿Qué diferencia hay entre una vulnerabilidad y una mala configuración?

- [x] La vulnerabilidad es un fallo del software; la mala configuración es un ajuste inseguro que se puede corregir
- [ ] Son exactamente lo mismo
- [ ] La mala configuración solo ocurre en la nube
- [ ] La vulnerabilidad siempre se corrige con una contraseña

El hardening se centra sobre todo en corregir configuraciones inseguras y aplicar parches.

## ¿Qué debe hacerse con las cuentas y contraseñas predeterminadas de fábrica?

- [x] Cambiarlas o desactivarlas antes de poner el sistema en producción
- [ ] Mantenerlas para facilitar el soporte
- [ ] Compartirlas con todo el equipo
- [ ] Documentarlas en el servidor

Las credenciales por defecto son de las primeras que prueba un atacante.

## ¿Por qué se recomienda desactivar el inicio de sesión directo como root por SSH?

- [x] Para obligar a usar cuentas nominales y registrar quién ejecuta cada acción con sudo
- [ ] Porque root no puede usar SSH
- [ ] Para acelerar la conexión
- [ ] Porque SSH no permite contraseñas

Con `PermitRootLogin no` se reduce el riesgo de fuerza bruta y mejora la trazabilidad.

## ¿Qué método de autenticación SSH es más seguro que la contraseña?

- [x] Claves públicas/privadas, preferiblemente con una frase de paso
- [ ] Contraseñas cortas y fáciles de recordar
- [ ] Compartir la contraseña por el chat
- [ ] Autenticación anónima

Se combina con `PasswordAuthentication no` para impedir ataques de fuerza bruta.

## ¿Qué directiva de SSH desactiva el acceso por contraseña?

Respuesta: PasswordAuthentication no

Se configura en `/etc/ssh/sshd_config`.

## ¿Qué principio se aplica al cortafuegos de un servidor?

- [x] Denegar todo por defecto y permitir solo el tráfico necesario
- [ ] Permitir todo por defecto y bloquear lo malicioso
- [ ] Desactivar el cortafuegos en redes internas
- [ ] Abrir todos los puertos y vigilarlos

La política de denegación por defecto limita el tráfico entrante y saliente a lo imprescindible.

## ¿Qué conviene hacer con los servicios que no se usan?

- [x] Desinstalarlos o desactivarlos y cerrar sus puertos
- [ ] Dejarlos activos por si acaso
- [ ] Cambiarles el nombre
- [ ] Solo ocultarlos en la interfaz

Cada servicio activo es una posible puerta de entrada.

## ¿Qué ventaja tiene automatizar los parches de seguridad?

- [x] Reduce el tiempo en que una vulnerabilidad conocida puede explotarse
- [ ] Elimina la necesidad de hacer pruebas
- [ ] Evita tener que hacer copias de seguridad
- [ ] Aumenta la superficie de ataque

Debe combinarse con pruebas previas en un entorno de preproducción.

## ¿Para qué sirve SELinux o AppArmor en Linux?

- [x] Aplicar control de acceso obligatorio (MAC) para confinar lo que puede hacer cada proceso
- [ ] Comprimir archivos
- [ ] Gestionar las contraseñas de los usuarios
- [ ] Acelerar la red

Aunque un proceso sea comprometido, sus acciones quedan limitadas por la política.

## ¿Qué significa aplicar un baseline (línea base) de configuración?

- [x] Definir una configuración segura estándar y comprobar que los sistemas se ajustan a ella
- [ ] Instalar el sistema una sola vez
- [ ] Copiar la configuración de un servidor al azar
- [ ] Desactivar todas las opciones

Permite detectar desviaciones (drift) y repetir el hardening de forma consistente.

## ¿Qué práctica protege el firmware y el arranque del equipo?

- [x] Arranque seguro (Secure Boot) y contraseña de BIOS/UEFI
- [ ] Dejar el arranque desde USB habilitado
- [ ] Desactivar el TPM
- [ ] Actualizar el firmware solo si falla

Impide arrancar sistemas operativos o cargadores sin firmar.

## ¿Qué se recomienda para proteger los datos de un portátil perdido o robado?

- [x] Cifrado de disco completo (por ejemplo BitLocker o LUKS)
- [ ] Una contraseña de usuario sencilla
- [ ] Ocultar la carpeta de documentos
- [ ] Cambiar el fondo de pantalla

Sin la clave de cifrado, los datos del disco son ilegibles.

## ¿Qué es la autenticación multifactor (MFA)?

- [x] Exigir dos o más factores distintos: algo que sabes, algo que tienes o algo que eres
- [ ] Usar dos contraseñas
- [ ] Cambiar la contraseña con frecuencia
- [ ] Iniciar sesión desde dos dispositivos

Aunque roben la contraseña, el atacante necesita otro factor.

## ¿Qué buena práctica se aplica a los contenedores Docker en producción?

- [x] Ejecutarlos como usuario no root y con el sistema de archivos en solo lectura cuando sea posible
- [ ] Ejecutarlos siempre como root
- [ ] Montar el socket de Docker dentro de cada contenedor
- [ ] Usar la etiqueta `latest` sin revisar

Reduce el impacto si un atacante logra ejecutar código dentro del contenedor.

## ¿Qué conviene usar para construir imágenes de contenedor más seguras?

- [x] Imágenes base mínimas (distroless o Alpine) y escaneo de vulnerabilidades
- [ ] Imágenes con todas las herramientas de depuración
- [ ] Imágenes de origen desconocido
- [ ] Imágenes sin versionar

Menos paquetes significa menos vulnerabilidades potenciales.

## ¿Qué práctica es esencial en el hardening de una base de datos?

- [x] No exponerla a internet y usar cuentas con permisos mínimos por aplicación
- [ ] Usar una sola cuenta de administrador para todas las aplicaciones
- [ ] Permitir conexiones desde cualquier IP
- [ ] Guardar las contraseñas en texto plano

Se complementa con cifrado en tránsito y en reposo y con auditoría de accesos.

## ¿Qué cabecera HTTP obliga al navegador a usar siempre HTTPS con un sitio?

Respuesta: Strict-Transport-Security

Se conoce como HSTS y evita ataques de degradación a HTTP.

## ¿Qué versión mínima de TLS se recomienda hoy para conexiones seguras?

- [x] TLS 1.2 (preferiblemente 1.3)
- [ ] SSL 3.0
- [ ] TLS 1.0
- [ ] TLS 1.1

Las versiones SSL y TLS 1.0/1.1 están obsoletas y tienen debilidades conocidas.

## ¿Cómo se debe proteger el acceso a la consola de administración de un servicio en la nube?

- [x] MFA obligatorio, roles con mínimo privilegio y sin usar la cuenta raíz para el día a día
- [ ] Una contraseña compartida por todo el equipo
- [ ] Acceso público desde cualquier lugar
- [ ] Claves de acceso sin caducidad en el código

La cuenta raíz solo debe usarse para tareas excepcionales.

## ¿Para qué sirven los registros y alertas en un sistema endurecido?

- [x] Detectar y responder a intentos de intrusión o cambios no autorizados
- [ ] Solo para ocupar espacio en disco
- [ ] Para reemplazar a las copias de seguridad
- [ ] Para acelerar el sistema

Un buen hardening incluye enviar los registros a un lugar centralizado e inalterable.

## ¿Qué herramienta de código abierto permite auditar la configuración de seguridad de un sistema Linux?

- [x] Lynis
- [ ] Wireshark
- [ ] Docker
- [ ] Terraform

Lynis revisa la configuración y propone mejoras de endurecimiento. Wireshark analiza tráfico de red.
