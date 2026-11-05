# DevOps

Conceptos esenciales de DevOps: cultura, CI/CD, contenedores, infraestructura como código, Kubernetes y observabilidad.

## ¿Qué busca principalmente la cultura DevOps?

- [x] Unir desarrollo y operaciones para entregar software más rápido y con fiabilidad
- [ ] Que operaciones apruebe cada cambio manualmente
- [ ] Reemplazar al equipo de desarrollo por automatización
- [ ] Hacer un lanzamiento grande al año

Se basa en colaboración, automatización y retroalimentación continua.

## ¿Qué significa CI en CI/CD?

- [x] Integración continua
- [ ] Control de incidentes
- [ ] Infraestructura en la nube
- [ ] Compilación interna

Cada cambio se integra con frecuencia en la rama principal y se verifica con compilación y pruebas automáticas.

## ¿Cuál es la diferencia entre entrega continua y despliegue continuo?

- [x] En la entrega continua el paso a producción requiere una aprobación manual; en el despliegue continuo es automático
- [ ] Son exactamente lo mismo
- [ ] La entrega continua no ejecuta pruebas
- [ ] El despliegue continuo solo ocurre en desarrollo

Ambos mantienen el software siempre listo para liberar; cambia quién aprieta el botón final.

## ¿Qué práctica consiste en fusionar cambios pequeños a la rama principal varias veces al día?

- [x] Desarrollo basado en troncal (trunk-based development)
- [ ] Ramas de larga duración por funcionalidad
- [ ] Congelamiento de código mensual
- [ ] Bifurcación de repositorios

Reduce los conflictos de integración y acorta el ciclo de retroalimentación.

## ¿Qué es la infraestructura como código (IaC)?

- [x] Definir y gestionar la infraestructura con archivos versionados y reproducibles
- [ ] Escribir código que se ejecuta solo en servidores físicos
- [ ] Instalar servidores a mano siguiendo un manual
- [ ] Un lenguaje de programación propio de la nube

Permite revisar, versionar y repetir entornos igual que el código de una aplicación.

## ¿Cuál de estas herramientas es de infraestructura como código?

- [x] Terraform
- [ ] Prometheus
- [ ] Jenkins
- [ ] Grafana

Terraform describe la infraestructura de forma declarativa. Jenkins es CI/CD y Prometheus y Grafana son de monitoreo.

## ¿Qué significa que una herramienta IaC sea declarativa?

- [x] Describes el estado final deseado y la herramienta calcula cómo llegar a él
- [ ] Describes cada paso en el orden exacto de ejecución
- [ ] Solo funciona con scripts de shell
- [ ] No guarda ningún estado

Con Terraform defines qué recursos quieres, no los comandos para crearlos.

## ¿Qué es la idempotencia en automatización?

- [x] Ejecutar la misma operación varias veces da el mismo resultado final
- [ ] Ejecutar la operación solo una vez en la vida
- [ ] Que la operación nunca falla
- [ ] Que la operación es muy rápida

Es clave para poder volver a aplicar una configuración sin efectos secundarios.

## ¿Qué problema resuelven los contenedores?

- [x] Empaquetar la aplicación con sus dependencias para que se ejecute igual en cualquier entorno
- [ ] Reemplazar por completo al sistema operativo
- [ ] Cifrar automáticamente los datos
- [ ] Eliminar la necesidad de redes

Resuelven el clásico "en mi máquina funciona".

## ¿En qué se diferencia un contenedor de una máquina virtual?

- [x] El contenedor comparte el kernel del host; la máquina virtual incluye su propio sistema operativo
- [ ] El contenedor incluye un sistema operativo completo propio
- [ ] La máquina virtual es siempre más liviana
- [ ] No hay ninguna diferencia

Por eso los contenedores arrancan en segundos y consumen menos recursos.

## ¿Qué archivo define cómo se construye una imagen Docker?

Respuesta: Dockerfile

Contiene las instrucciones (FROM, COPY, RUN, CMD…) para construir la imagen.

## ¿Qué diferencia hay entre una imagen y un contenedor de Docker?

- [x] La imagen es la plantilla inmutable; el contenedor es una instancia en ejecución de ella
- [ ] El contenedor es la plantilla y la imagen es la instancia
- [ ] Son sinónimos
- [ ] La imagen solo existe en Docker Hub

Una misma imagen puede dar origen a muchos contenedores.

## ¿Qué hace el comando `docker compose up`?

- [x] Levanta los servicios definidos en el archivo compose
- [ ] Sube una imagen a un registro
- [ ] Borra todos los contenedores
- [ ] Actualiza Docker

Permite definir una aplicación de varios contenedores en un solo archivo YAML.

## ¿Qué es Kubernetes?

- [x] Un orquestador de contenedores que automatiza despliegue, escalado y recuperación
- [ ] Un sistema de control de versiones
- [ ] Un lenguaje de configuración
- [ ] Un servicio de correo

Gestiona clústeres de contenedores y los mantiene en el estado deseado.

## ¿Cuál es la unidad mínima desplegable en Kubernetes?

Respuesta: Pod

Un Pod agrupa uno o más contenedores que comparten red y almacenamiento.

## ¿Qué objeto de Kubernetes mantiene un número deseado de réplicas de un Pod y permite actualizaciones graduales?

- [x] Deployment
- [ ] Namespace
- [ ] ConfigMap
- [ ] Ingress

El Deployment gestiona ReplicaSets y las actualizaciones progresivas (rolling updates).

## ¿Para qué sirve un Service en Kubernetes?

- [x] Dar una dirección estable para acceder a un conjunto de Pods
- [ ] Guardar contraseñas cifradas
- [ ] Construir imágenes de contenedor
- [ ] Programar tareas periódicas

Los Pods cambian de IP; el Service ofrece un punto de acceso fijo con balanceo.

## ¿En qué consiste un despliegue blue-green?

- [x] Mantener dos entornos y cambiar el tráfico del antiguo al nuevo de una vez
- [ ] Desplegar solo en el entorno de pruebas
- [ ] Enviar el nuevo código a un pequeño porcentaje de usuarios
- [ ] Apagar el sistema durante el cambio

Permite volver atrás de inmediato redirigiendo el tráfico al entorno anterior.

## ¿En qué consiste un despliegue canary?

- [x] Liberar la nueva versión a un pequeño grupo de usuarios antes de extenderla a todos
- [ ] Mantener dos entornos idénticos y alternarlos
- [ ] Desplegar siempre de noche
- [ ] Reiniciar todos los servidores a la vez

Limita el impacto de un posible fallo y permite observar métricas antes de continuar.

## ¿Qué es GitOps?

- [x] Usar Git como fuente única de verdad del estado deseado de la infraestructura y las aplicaciones
- [ ] Guardar solo código fuente en Git
- [ ] Hacer commits sin revisión
- [ ] Un servicio de alojamiento de repositorios

Un agente (como Argo CD o Flux) sincroniza el clúster con lo declarado en el repositorio.

## ¿Qué son las "tres señales" principales de la observabilidad?

- [x] Métricas, registros (logs) y trazas
- [ ] CPU, memoria y disco
- [ ] Alertas, correos y tickets
- [ ] Pruebas, builds y despliegues

Juntas permiten entender qué ocurre dentro de un sistema distribuido.

## ¿Qué herramienta se usa habitualmente para recolectar métricas de sistemas y aplicaciones?

- [x] Prometheus
- [ ] Terraform
- [ ] Ansible
- [ ] Vault

Prometheus recoge series temporales y suele combinarse con Grafana para visualizarlas.

## ¿Qué mide el MTTR?

- [x] El tiempo medio para recuperarse de un fallo
- [ ] El tiempo medio entre despliegues
- [ ] El porcentaje de despliegues fallidos
- [ ] El tiempo de compilación

Es una de las cuatro métricas DORA, junto con la frecuencia de despliegue, el tiempo de entrega y la tasa de fallos de cambio.

## ¿Cuál de estas NO es una métrica DORA?

- [x] Líneas de código por desarrollador
- [ ] Frecuencia de despliegue
- [ ] Tiempo de entrega de cambios
- [ ] Tasa de fallos de cambio

Las métricas DORA miden la velocidad y la estabilidad de la entrega, no la cantidad de código.

## ¿Qué práctica propone DevSecOps?

- [x] Integrar la seguridad en todo el ciclo de vida, desplazándola hacia el inicio ("shift left")
- [ ] Realizar la revisión de seguridad solo antes de salir a producción
- [ ] Delegar la seguridad a un equipo externo
- [ ] Eliminar las pruebas de seguridad para ir más rápido

Se automatizan análisis de código, dependencias y contenedores dentro del pipeline.

## ¿Dónde se deben guardar las contraseñas y claves de API de un pipeline?

- [x] En un gestor de secretos (como Vault o el de la plataforma de CI), nunca en el repositorio
- [ ] En el archivo README
- [ ] En el código fuente cifradas con Base64
- [ ] En el nombre de la rama

Los secretos deben inyectarse en tiempo de ejecución y rotarse con regularidad.
