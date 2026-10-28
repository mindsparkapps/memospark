# AWS Solutions Architect – Servicios clave

Reconoce los servicios por su ícono y elige el correcto para cada escenario: IAM, EC2, S3, VPC, ELB y Auto Scaling, RDS y Aurora, Lambda y API Gateway, SQS y SNS, CloudFront y Route 53, DynamoDB, KMS y Secrets Manager, CloudWatch y CloudTrail, contenedores, CloudFormation, migración, backup y recuperación ante desastres.

Modos: Solo el nombre | Nombre y para qué sirve

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Identity-and-Access-Management.svg)

- [x] AWS IAM || **AWS IAM** — controla quién puede hacer qué en tu cuenta (usuarios, grupos, roles y políticas)
- [ ] AWS KMS || **AWS KMS** — crea y administra claves de cifrado
- [ ] AWS Secrets Manager || **AWS Secrets Manager** — guarda y rota credenciales
- [ ] Amazon Cognito || **Amazon Cognito** — registro e inicio de sesión de los usuarios de tus apps

IAM (Identity and Access Management) es global y gratuito: usuarios, grupos, **roles** (permisos temporales) y **políticas** JSON.

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Compute/EC2.svg)

- [x] Amazon EC2 || **Amazon EC2** — servidores virtuales (instancias) que tú administras
- [ ] AWS Lambda || **AWS Lambda** — ejecuta código sin servidores, por evento
- [ ] AWS Fargate || **AWS Fargate** — ejecuta contenedores sin administrar servidores
- [ ] Amazon Lightsail || **Amazon Lightsail** — servidores privados virtuales simples con precio fijo

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/Elastic-Block-Store.svg)

- [ ] Amazon EFS || **Amazon EFS** — sistema de archivos NFS compartido entre muchas instancias
- [x] Amazon EBS || **Amazon EBS** — discos de bloque para una instancia EC2, dentro de una zona de disponibilidad
- [ ] Amazon S3 || **Amazon S3** — almacenamiento de objetos
- [ ] Amazon FSx || **Amazon FSx** — sistemas de archivos administrados (Windows, Lustre, NetApp ONTAP)

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/EFS.svg)

- [x] Amazon EFS || **Amazon EFS** — sistema de archivos NFS compartido entre muchas instancias Linux, en varias AZ
- [ ] Amazon EBS || **Amazon EBS** — discos de bloque para una instancia EC2
- [ ] AWS Storage Gateway || **AWS Storage Gateway** — conecta el almacenamiento local con AWS
- [ ] Amazon S3 Glacier || **Amazon S3 Glacier** — archivo a largo plazo de bajo costo

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg)

- [ ] Amazon EBS || **Amazon EBS** — discos de bloque para EC2
- [ ] Amazon DynamoDB || **Amazon DynamoDB** — base de datos NoSQL clave-valor
- [x] Amazon S3 || **Amazon S3** — almacenamiento de objetos ilimitado, con 11 nueves de durabilidad
- [ ] Amazon EFS || **Amazon EFS** — sistema de archivos compartido

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service-Glacier.svg)

- [x] Amazon S3 Glacier || **Amazon S3 Glacier** — clases de S3 para archivar datos a muy bajo costo
- [ ] AWS Backup || **AWS Backup** — copias de seguridad centralizadas
- [ ] AWS Snowball || **AWS Snowball** — dispositivo físico para mover datos
- [ ] Amazon EFS || **Amazon EFS** — sistema de archivos compartido

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Virtual-Private-Cloud.svg)

- [x] Amazon VPC || **Amazon VPC** — tu red privada aislada en AWS (subredes, rutas, gateways)
- [ ] AWS Direct Connect || **AWS Direct Connect** — enlace de red privado y dedicado hacia AWS
- [ ] Amazon Route 53 || **Amazon Route 53** — DNS administrado
- [ ] AWS PrivateLink || **AWS PrivateLink** — expone servicios en forma privada mediante endpoints

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg)

- [ ] Amazon EC2 Auto Scaling || **Amazon EC2 Auto Scaling** — agrega o quita instancias según la demanda
- [x] Elastic Load Balancing || **Elastic Load Balancing** — reparte el tráfico entre destinos sanos (ALB, NLB, GWLB)
- [ ] Amazon CloudFront || **Amazon CloudFront** — CDN que cachea contenido cerca del usuario
- [ ] Amazon API Gateway || **Amazon API Gateway** — publica y protege APIs

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Compute/EC2-Auto-Scaling.svg)

- [x] Amazon EC2 Auto Scaling || **Amazon EC2 Auto Scaling** — agrega o quita instancias según la demanda y reemplaza las que fallan
- [ ] Elastic Load Balancing || **Elastic Load Balancing** — reparte el tráfico entre destinos
- [ ] AWS Elastic Beanstalk || **AWS Elastic Beanstalk** — despliega apps web sin configurar la infraestructura
- [ ] Amazon CloudWatch || **Amazon CloudWatch** — métricas, logs y alarmas

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Database/RDS.svg)

- [ ] Amazon DynamoDB || **Amazon DynamoDB** — base NoSQL clave-valor
- [ ] Amazon ElastiCache || **Amazon ElastiCache** — caché en memoria (Redis, Memcached)
- [x] Amazon RDS || **Amazon RDS** — bases de datos relacionales administradas (MySQL, PostgreSQL, Oracle, SQL Server…)
- [ ] Amazon Redshift || **Amazon Redshift** — almacén de datos para análisis

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Database/Aurora.svg)

- [x] Amazon Aurora || **Amazon Aurora** — base relacional de AWS compatible con MySQL y PostgreSQL, con 6 copias en 3 AZ
- [ ] Amazon RDS for MySQL || **Amazon RDS for MySQL** — MySQL administrado clásico
- [ ] Amazon DynamoDB || **Amazon DynamoDB** — base NoSQL clave-valor
- [ ] Amazon Neptune || **Amazon Neptune** — base de datos de grafos

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg)

- [ ] AWS Fargate || **AWS Fargate** — contenedores sin servidores
- [x] AWS Lambda || **AWS Lambda** — ejecuta funciones sin servidores ante eventos; pagas por invocación y duración
- [ ] Amazon EC2 || **Amazon EC2** — servidores virtuales
- [ ] AWS Step Functions || **AWS Step Functions** — orquesta pasos de un flujo de trabajo

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg)

- [x] Amazon API Gateway || **Amazon API Gateway** — crea, publica y protege APIs REST, HTTP y WebSocket
- [ ] Elastic Load Balancing || **Elastic Load Balancing** — reparte el tráfico
- [ ] Amazon CloudFront || **Amazon CloudFront** — CDN
- [ ] AWS AppSync || **AWS AppSync** — APIs GraphQL administradas

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg)

- [ ] Amazon SNS || **Amazon SNS** — publica un mensaje a muchos suscriptores
- [x] Amazon SQS || **Amazon SQS** — colas de mensajes para desacoplar productores y consumidores
- [ ] Amazon Kinesis || **Amazon Kinesis** — streaming de datos en tiempo real
- [ ] Amazon EventBridge || **Amazon EventBridge** — bus de eventos con reglas

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Notification-Service.svg)

- [x] Amazon SNS || **Amazon SNS** — publicación/suscripción: un mensaje llega a muchos destinos (SQS, Lambda, correo, SMS)
- [ ] Amazon SQS || **Amazon SQS** — colas de mensajes
- [ ] Amazon SES || **Amazon SES** — envío de correos electrónicos
- [ ] Amazon EventBridge || **Amazon EventBridge** — bus de eventos

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg)

- [ ] Amazon Route 53 || **Amazon Route 53** — DNS administrado
- [ ] AWS Global Accelerator || **AWS Global Accelerator** — IPs fijas que llevan el tráfico por la red de AWS
- [x] Amazon CloudFront || **Amazon CloudFront** — CDN: cachea contenido en ubicaciones cercanas al usuario
- [ ] Elastic Load Balancing || **Elastic Load Balancing** — reparte el tráfico

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Route-53.svg)

- [x] Amazon Route 53 || **Amazon Route 53** — DNS administrado, registro de dominios y políticas de enrutamiento con health checks
- [ ] Amazon CloudFront || **Amazon CloudFront** — CDN
- [ ] Amazon VPC || **Amazon VPC** — red privada
- [ ] AWS Direct Connect || **AWS Direct Connect** — enlace privado dedicado

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg)

- [ ] Amazon RDS || **Amazon RDS** — bases relacionales administradas
- [ ] Amazon Aurora || **Amazon Aurora** — base relacional de AWS
- [ ] Amazon ElastiCache || **Amazon ElastiCache** — caché en memoria
- [x] Amazon DynamoDB || **Amazon DynamoDB** — NoSQL clave-valor sin servidores, con latencia de milisegundos a cualquier escala

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Key-Management-Service.svg)

- [x] AWS KMS || **AWS KMS** — crea y controla claves de cifrado usadas por los servicios de AWS
- [ ] AWS Secrets Manager || **AWS Secrets Manager** — guarda y rota credenciales
- [ ] AWS IAM || **AWS IAM** — permisos y roles
- [ ] AWS Certificate Manager || **AWS Certificate Manager** — certificados SSL/TLS

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Secrets-Manager.svg)

- [ ] AWS KMS || **AWS KMS** — claves de cifrado
- [x] AWS Secrets Manager || **AWS Secrets Manager** — guarda credenciales y las rota automáticamente
- [ ] AWS Systems Manager || **AWS Systems Manager** — administra y automatiza servidores
- [ ] AWS IAM || **AWS IAM** — permisos y roles

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Management-Governance/CloudWatch.svg)

- [x] Amazon CloudWatch || **Amazon CloudWatch** — métricas, logs, alarmas y paneles de tus recursos
- [ ] AWS CloudTrail || **AWS CloudTrail** — registro de las llamadas a la API
- [ ] AWS Config || **AWS Config** — historial de configuración y cumplimiento
- [ ] AWS X-Ray || **AWS X-Ray** — trazas de solicitudes entre servicios

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Management-Governance/CloudTrail.svg)

- [ ] Amazon CloudWatch || **Amazon CloudWatch** — métricas, logs y alarmas
- [x] AWS CloudTrail || **AWS CloudTrail** — auditoría: quién hizo qué llamada a la API, cuándo y desde dónde
- [ ] AWS Config || **AWS Config** — historial de configuración
- [ ] Amazon GuardDuty || **Amazon GuardDuty** — detección de amenazas

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Containers/Elastic-Container-Service.svg)

- [x] Amazon ECS || **Amazon ECS** — orquestador de contenedores propio de AWS
- [ ] Amazon EKS || **Amazon EKS** — Kubernetes administrado
- [ ] Amazon ECR || **Amazon ECR** — registro de imágenes de contenedores
- [ ] AWS Fargate || **AWS Fargate** — contenedores sin servidores

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Containers/Elastic-Kubernetes-Service.svg)

- [ ] Amazon ECS || **Amazon ECS** — orquestador de contenedores de AWS
- [x] Amazon EKS || **Amazon EKS** — Kubernetes administrado por AWS
- [ ] AWS Fargate || **AWS Fargate** — contenedores sin servidores
- [ ] AWS App Runner || **AWS App Runner** — despliega apps web desde código o una imagen

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Containers/Fargate.svg)

- [ ] Amazon EC2 || **Amazon EC2** — servidores virtuales
- [ ] AWS Lambda || **AWS Lambda** — funciones sin servidores
- [x] AWS Fargate || **AWS Fargate** — motor sin servidores para contenedores de ECS y EKS: no administras instancias
- [ ] Amazon ECR || **Amazon ECR** — registro de imágenes

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Containers/Elastic-Container-Registry.svg)

- [x] Amazon ECR || **Amazon ECR** — registro privado de imágenes de contenedores
- [ ] Amazon ECS || **Amazon ECS** — orquestador de contenedores
- [ ] Amazon S3 || **Amazon S3** — almacenamiento de objetos
- [ ] AWS CodeArtifact || **AWS CodeArtifact** — repositorio de paquetes de software

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Management-Governance/CloudFormation.svg)

- [ ] AWS Elastic Beanstalk || **AWS Elastic Beanstalk** — despliega apps web sin configurar la infraestructura
- [x] AWS CloudFormation || **AWS CloudFormation** — infraestructura como código: plantillas que crean pilas de recursos
- [ ] AWS Systems Manager || **AWS Systems Manager** — administra servidores
- [ ] AWS Service Catalog || **AWS Service Catalog** — catálogo de productos aprobados

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Database/Database-Migration-Service.svg)

- [x] AWS DMS || **AWS Database Migration Service** — migra bases de datos con mínima interrupción, incluso entre motores distintos
- [ ] AWS DataSync || **AWS DataSync** — copia archivos y objetos en línea
- [ ] AWS Application Migration Service || **AWS Application Migration Service** — migra servidores completos
- [ ] AWS Backup || **AWS Backup** — copias de seguridad centralizadas

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Migration-Transfer/Application-Migration-Service.svg)

- [ ] AWS DMS || **AWS DMS** — migra bases de datos
- [x] AWS Application Migration Service || **AWS Application Migration Service (MGN)** — migra servidores tal cual (lift-and-shift) a EC2
- [ ] AWS Elastic Disaster Recovery || **AWS Elastic Disaster Recovery** — replica servidores para recuperarlos ante un desastre
- [ ] AWS Migration Hub || **AWS Migration Hub** — sigue el avance de las migraciones

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/Backup.svg)

- [x] AWS Backup || **AWS Backup** — copias de seguridad centralizadas y con políticas para EBS, RDS, DynamoDB, EFS y más
- [ ] Amazon S3 Glacier || **Amazon S3 Glacier** — archivo de bajo costo
- [ ] AWS Elastic Disaster Recovery || **AWS Elastic Disaster Recovery** — recuperación de servidores ante desastres
- [ ] AWS Storage Gateway || **AWS Storage Gateway** — conecta el almacenamiento local con AWS

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/Elastic-Disaster-Recovery.svg)

- [ ] AWS Backup || **AWS Backup** — copias de seguridad centralizadas
- [ ] AWS Application Migration Service || **AWS Application Migration Service** — migración lift-and-shift
- [x] AWS Elastic Disaster Recovery || **AWS Elastic Disaster Recovery** — replica servidores continuamente para recuperarlos en minutos
- [ ] Amazon Route 53 || **Amazon Route 53** — DNS y failover

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Storage/Snowball.svg)

- [x] AWS Snowball || **AWS Snowball** — dispositivo físico para mover terabytes a AWS sin depender de internet
- [ ] AWS DataSync || **AWS DataSync** — transferencia de datos en línea
- [ ] AWS Direct Connect || **AWS Direct Connect** — enlace privado dedicado
- [ ] AWS Storage Gateway || **AWS Storage Gateway** — almacenamiento híbrido

## Una instancia EC2 necesita leer objetos de un bucket de S3. ¿Cuál es la forma más segura de darle permiso?

- [x] Un rol de IAM asociado a la instancia || **Rol de IAM en la instancia** — entrega credenciales temporales que se rotan solas
- [ ] Claves de acceso guardadas en el código || **Claves de acceso en el código** — credenciales permanentes que se pueden filtrar
- [ ] Un usuario de IAM compartido || **Usuario de IAM compartido** — credenciales permanentes usadas por varios
- [ ] Hacer público el bucket || **Bucket público** — cualquiera en internet podría leerlo

![IAM](https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Identity-and-Access-Management.svg)

Los **roles** dan credenciales temporales sin guardar secretos. Es la respuesta para casi cualquier «un servicio de AWS necesita acceder a otro».

## Una política de IAM permite `s3:DeleteObject` y otra política del mismo usuario lo deniega explícitamente. ¿Qué ocurre?

- [ ] Se permite, porque gana el Allow || **Se permite** — el Allow nunca le gana a un Deny explícito
- [x] Se deniega, porque gana el Deny explícito || **Se deniega** — un Deny explícito siempre gana sobre cualquier Allow
- [ ] Gana la política más reciente || **Gana la más reciente** — IAM no considera el orden
- [ ] Da un error de configuración || **Error de configuración** — es una combinación válida

Orden de evaluación de IAM: por defecto todo está denegado; un Allow lo permite, pero un **Deny explícito** gana siempre.

## En AWS Organizations, ¿qué limita los permisos máximos de todas las cuentas de una unidad organizativa, incluso para el usuario root de esas cuentas?

- [ ] Una política de IAM en cada cuenta || **Política de IAM** — solo afecta a los usuarios y roles a los que se asigna
- [ ] Un permissions boundary || **Permissions boundary** — limita a un usuario o rol, no a la cuenta completa
- [x] Una SCP (Service Control Policy) || **SCP** — fija el máximo permitido para todas las identidades de las cuentas, root incluido
- [ ] Una política de bucket || **Política de bucket** — solo controla el acceso a un bucket

Las SCP no dan permisos: solo marcan el techo. Dentro de ese techo, cada cuenta sigue necesitando sus políticas de IAM.

## ¿Cuál es la buena práctica para el usuario root de una cuenta de AWS?

- [x] Activarle MFA y no usarlo en el día a día || **MFA y no usarlo a diario** — se crean usuarios o roles con lo mínimo necesario
- [ ] Usarlo para administrar porque tiene todos los permisos || **Usarlo para administrar** — si se filtra, se pierde el control de toda la cuenta
- [ ] Crearle claves de acceso para scripts || **Claves de acceso del root** — nunca se recomiendan
- [ ] Compartirlo con el equipo de operaciones || **Compartirlo** — impide saber quién hizo cada cosa

## Una aplicación usa instancias EC2 de forma constante 24/7 y lo seguirá haciendo 3 años. ¿Qué opción de compra es más barata?

- [ ] Instancias On-Demand || **On-Demand** — sin compromiso, el precio más alto por hora
- [ ] Instancias Spot || **Spot** — muy baratas, pero AWS puede interrumpirlas con 2 minutos de aviso
- [x] Instancias reservadas o Savings Plans || **Reservadas / Savings Plans** — hasta ~72 % de descuento a cambio de un compromiso de 1 o 3 años
- [ ] Hosts dedicados || **Hosts dedicados** — un servidor físico para ti; para licencias o cumplimiento

![EC2](https://icon.icepanel.io/AWS/svg/Compute/EC2.svg)

## Un proceso por lotes tolera interrupciones y puede reanudarse. ¿Qué tipo de instancia minimiza el costo?

- [x] Instancias Spot || **Spot** — usan capacidad sobrante con hasta 90 % de descuento; pueden interrumpirse
- [ ] Instancias reservadas || **Reservadas** — para uso constante y predecible
- [ ] Instancias On-Demand || **On-Demand** — sin descuento
- [ ] Hosts dedicados || **Hosts dedicados** — los más caros

## ¿Qué control de red actúa a nivel de instancia y es *stateful* (la respuesta a una conexión permitida sale sola)?

- [x] Security Group || **Security Group** — firewall de la instancia, stateful y solo con reglas de permitir
- [ ] Network ACL || **Network ACL** — firewall de la subred, stateless y con reglas de permitir y denegar
- [ ] Tabla de rutas || **Tabla de rutas** — decide hacia dónde va el tráfico, no lo filtra
- [ ] Internet Gateway || **Internet Gateway** — conecta la VPC con internet

## Varias instancias EC2 Linux en distintas zonas de disponibilidad necesitan el mismo sistema de archivos compartido. ¿Qué usas?

- [ ] Un volumen EBS || **EBS** — se conecta a una instancia (Multi-Attach solo en la misma AZ y con tipos io1/io2)
- [x] Amazon EFS || **Amazon EFS** — NFS administrado, compartido por miles de instancias en varias AZ
- [ ] Instance store || **Instance store** — disco local que se pierde al detener la instancia
- [ ] Amazon S3 montado como disco || **S3** — es almacenamiento de objetos, no un sistema de archivos POSIX

![EFS](https://icon.icepanel.io/AWS/svg/Storage/EFS.svg)

## ¿Qué pasa con los datos de un volumen *instance store* al detener la instancia EC2?

- [x] Se pierden || **Se pierden** — es almacenamiento efímero, ideal para caché o datos temporales
- [ ] Se guardan en S3 automáticamente || **Se guardan en S3** — no hay copia automática
- [ ] Se conservan como en EBS || **Se conservan** — solo EBS persiste al detener
- [ ] Pasan a un snapshot || **Snapshot automático** — los snapshots son de EBS

## Una aplicación HPC necesita la menor latencia de red posible entre sus instancias. ¿Qué usas?

- [x] Un placement group de tipo cluster || **Placement group cluster** — instancias juntas en el mismo rack/AZ para baja latencia
- [ ] Un placement group de tipo spread || **Placement group spread** — reparte instancias en hardware distinto para tolerar fallas
- [ ] Instancias en varias regiones || **Varias regiones** — aumenta la latencia
- [ ] Un Application Load Balancer || **ALB** — reparte tráfico HTTP, no reduce la latencia entre instancias

## Datos que se leen pocas veces pero, cuando se necesitan, deben estar disponibles al instante. ¿Qué clase de S3 conviene?

- [ ] S3 Standard || **S3 Standard** — para datos de acceso frecuente
- [x] S3 Standard-IA || **S3 Standard-IA** — acceso poco frecuente, recuperación en milisegundos y costo menor por GB
- [ ] S3 Glacier Deep Archive || **Glacier Deep Archive** — recuperación en horas
- [ ] S3 Glacier Flexible Retrieval || **Glacier Flexible Retrieval** — recuperación en minutos u horas

![S3](https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg)

## No sabes con qué frecuencia se accederá a unos datos y el patrón cambia con el tiempo. ¿Qué clase de S3 eliges?

- [x] S3 Intelligent-Tiering || **S3 Intelligent-Tiering** — mueve cada objeto solo entre niveles según su uso, sin costo de recuperación
- [ ] S3 One Zone-IA || **S3 One Zone-IA** — más barata, pero en una sola AZ
- [ ] S3 Standard || **S3 Standard** — siempre el precio de acceso frecuente
- [ ] S3 Glacier Instant Retrieval || **Glacier Instant Retrieval** — para datos de archivo consultados una vez por trimestre

## Registros que se deben guardar 7 años por normativa y casi nunca se leen; si se piden, basta tenerlos en 12 horas. ¿La opción más barata?

- [ ] S3 Standard-IA || **S3 Standard-IA** — más cara que las clases de archivo
- [ ] S3 Glacier Instant Retrieval || **Glacier Instant Retrieval** — recuperación inmediata, más cara que Deep Archive
- [x] S3 Glacier Deep Archive || **S3 Glacier Deep Archive** — la clase más barata; recuperación en hasta 12 horas
- [ ] Volúmenes EBS cold HDD || **EBS sc1** — mucho más caro por GB que el archivo en S3

![Glacier](https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service-Glacier.svg)

## ¿Cómo mueves automáticamente los objetos de S3 a Glacier 90 días después de crearlos y los borras a los 5 años?

- [x] Con una regla de ciclo de vida (lifecycle) || **Regla de ciclo de vida** — transiciones entre clases y expiración automáticas
- [ ] Con S3 Replication || **Replicación** — copia objetos a otro bucket, no cambia la clase con el tiempo
- [ ] Con una función Lambda diaria || **Lambda programada** — funciona, pero es trabajo que S3 ya hace solo
- [ ] Con versionado || **Versionado** — guarda versiones anteriores, no mueve objetos

## Debes cifrar los objetos de S3 con claves que tú controlas y dejar auditado cada uso de la clave. ¿Qué opción de cifrado usas?

- [ ] SSE-S3 || **SSE-S3** — claves administradas por S3, sin control ni auditoría por clave
- [x] SSE-KMS || **SSE-KMS** — claves de KMS: controlas su política y cada uso queda en CloudTrail
- [ ] Sin cifrado y con bucket privado || **Sin cifrado** — no cumple el requisito
- [ ] Cifrado en el cliente con una contraseña fija || **Contraseña fija** — difícil de rotar y sin auditoría

![KMS](https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Key-Management-Service.svg)

## ¿Qué protege los objetos de S3 contra el borrado accidental, permitiendo recuperarlos?

- [x] Activar el versionado (y MFA Delete) || **Versionado + MFA Delete** — cada cambio crea una versión y borrar exige MFA
- [ ] Cifrado SSE-S3 || **Cifrado** — protege la confidencialidad, no evita borrados
- [ ] Transfer Acceleration || **Transfer Acceleration** — acelera las subidas
- [ ] Una clase de almacenamiento IA || **Clase IA** — solo cambia el costo

## Quieres dar acceso temporal a un objeto privado de S3 a un cliente externo, sin hacerlo público. ¿Qué usas?

- [x] Una URL prefirmada (presigned URL) || **URL prefirmada** — enlace con permiso y vencimiento firmados por quien la genera
- [ ] Una política de bucket pública || **Bucket público** — lo expone a todo el mundo
- [ ] Un usuario de IAM para el cliente || **Usuario de IAM** — demasiado para un acceso puntual
- [ ] Una ACL de lectura pública || **ACL pública** — lo expone a todo el mundo

## Instancias en una subred privada necesitan descargar actualizaciones de internet, sin aceptar conexiones entrantes. ¿Qué agregas?

- [ ] Un Internet Gateway en la subred privada || **Internet Gateway** — haría la subred pública
- [x] Un NAT Gateway en una subred pública || **NAT Gateway** — da salida a internet a las subredes privadas, sin permitir entradas
- [ ] Un VPC Endpoint de tipo gateway || **Gateway endpoint** — solo llega a S3 y DynamoDB
- [ ] VPC Peering || **VPC Peering** — conecta dos VPC, no da salida a internet

![VPC](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Virtual-Private-Cloud.svg)

El NAT Gateway es por AZ: para alta disponibilidad se pone uno en cada zona.

## ¿Qué hace que una subred sea *pública*?

- [x] Su tabla de rutas tiene una ruta 0.0.0.0/0 hacia un Internet Gateway || **Ruta al Internet Gateway** — eso, más IPs públicas en las instancias
- [ ] Que tenga un NAT Gateway || **NAT Gateway** — da salida a las privadas; no hace pública la subred
- [ ] Que su Network ACL permita todo || **Network ACL abierta** — no basta sin ruta a internet
- [ ] Que esté en la primera AZ || **Primera AZ** — no tiene relación

## Instancias en una subred privada deben leer de S3 sin pasar por internet ni por un NAT Gateway. ¿Qué usas?

- [ ] Un NAT Gateway || **NAT Gateway** — saldría por internet y cobra por GB procesado
- [x] Un VPC Endpoint de tipo gateway para S3 || **Gateway VPC Endpoint** — conexión privada a S3 o DynamoDB, sin costo, mediante la tabla de rutas
- [ ] AWS Direct Connect || **Direct Connect** — es para conectar tu centro de datos
- [ ] Un Internet Gateway || **Internet Gateway** — pasaría por internet

Los endpoints **gateway** existen solo para S3 y DynamoDB; los demás servicios usan endpoints **interface** (PrivateLink).

## ¿Qué control de red es *stateless* y funciona a nivel de subred, con reglas de permitir y de denegar?

- [ ] Security Group || **Security Group** — stateful, a nivel de instancia, solo reglas de permitir
- [x] Network ACL || **Network ACL** — stateless: hay que permitir también el tráfico de respuesta (puertos efímeros)
- [ ] AWS WAF || **AWS WAF** — filtra peticiones web en ALB, CloudFront o API Gateway
- [ ] AWS Shield || **AWS Shield** — protección contra ataques DDoS

## Necesitas que dos VPC se comuniquen con IPs privadas. ¿Qué es lo más simple?

- [x] VPC Peering || **VPC Peering** — conexión privada 1 a 1 entre dos VPC (no es transitiva)
- [ ] Un NAT Gateway || **NAT Gateway** — da salida a internet
- [ ] Un Internet Gateway en cada una || **Internet Gateway** — pasaría por internet
- [ ] Amazon CloudFront || **CloudFront** — es una CDN

Para muchas VPC, en lugar de una malla de peerings se usa **Transit Gateway**.

## Una aplicación web debe enviar `/api/*` a un grupo de servidores e `/imagenes/*` a otro. ¿Qué balanceador usas?

- [x] Application Load Balancer || **ALB** — capa 7 (HTTP/HTTPS): enruta por ruta, host o encabezados
- [ ] Network Load Balancer || **NLB** — capa 4 (TCP/UDP): no ve las rutas HTTP
- [ ] Gateway Load Balancer || **GWLB** — para appliances de seguridad de terceros
- [ ] Classic Load Balancer || **CLB** — generación antigua, sin reglas por ruta

![ELB](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg)

## Un juego en línea usa UDP, necesita millones de peticiones por segundo y una IP fija por zona. ¿Qué balanceador usas?

- [ ] Application Load Balancer || **ALB** — solo HTTP/HTTPS
- [x] Network Load Balancer || **NLB** — capa 4 (TCP/UDP), latencia ultrabaja y una IP estática por AZ
- [ ] Classic Load Balancer || **CLB** — generación antigua
- [ ] Amazon CloudFront || **CloudFront** — CDN para contenido HTTP

## ¿Cómo logras que una aplicación en EC2 siga funcionando si cae una zona de disponibilidad completa?

- [x] Un Auto Scaling group repartido en varias AZ, detrás de un balanceador || **ASG multi-AZ + ELB** — reemplaza instancias caídas y envía tráfico solo a las sanas
- [ ] Una instancia más grande || **Instancia más grande** — sigue siendo un único punto de falla
- [ ] Snapshots de EBS cada hora || **Snapshots** — sirven para recuperar, no evitan la caída
- [ ] Un placement group cluster || **Placement group cluster** — junta todo en una AZ

![Auto Scaling](https://icon.icepanel.io/AWS/svg/Compute/EC2-Auto-Scaling.svg)

## Quieres que un Auto Scaling group mantenga la CPU promedio cerca del 50 %. ¿Qué política usas?

- [x] Target tracking || **Target tracking** — agrega o quita instancias para mantener una métrica en un valor objetivo
- [ ] Scheduled scaling || **Scheduled** — escala a horas fijas
- [ ] Simple scaling || **Simple scaling** — un paso fijo por alarma, con espera entre cambios
- [ ] Capacidad fija || **Capacidad fija** — no escala

## ¿Qué opción de RDS da failover automático a una réplica síncrona en otra zona de disponibilidad?

- [x] Multi-AZ || **Multi-AZ** — standby síncrono en otra AZ para alta disponibilidad (no sirve lecturas en la versión clásica)
- [ ] Read replicas || **Read replicas** — copias asíncronas para escalar lecturas
- [ ] Snapshots manuales || **Snapshots** — copias puntuales para restaurar
- [ ] Instancias más grandes || **Escalar verticalmente** — más capacidad, no disponibilidad

![RDS](https://icon.icepanel.io/AWS/svg/Database/RDS.svg)

## Una base RDS está saturada de consultas de solo lectura para reportes. ¿Qué agregas?

- [ ] Multi-AZ || **Multi-AZ** — es para disponibilidad, no reparte lecturas
- [x] Read replicas || **Read replicas** — copias asíncronas que atienden lecturas (también en otras regiones)
- [ ] Un NAT Gateway || **NAT Gateway** — no tiene relación
- [ ] Más almacenamiento || **Más almacenamiento** — no reduce la carga de consultas

## Necesitas restaurar una base RDS al estado exacto de ayer a las 14:32. ¿Qué lo permite?

- [x] Los backups automáticos (point-in-time recovery) || **Backups automáticos** — restauran a cualquier segundo dentro de la retención (hasta 35 días)
- [ ] Una read replica || **Read replica** — replica también los errores
- [ ] Multi-AZ || **Multi-AZ** — el standby recibe los mismos cambios
- [ ] CloudTrail || **CloudTrail** — registra llamadas a la API, no datos

La restauración crea **una instancia nueva**; luego apuntas la aplicación a ella.

## Una aplicación global necesita lecturas de baja latencia en varias regiones y recuperación ante el fallo de una región en menos de un minuto. ¿Qué usas?

- [x] Aurora Global Database || **Aurora Global Database** — réplicas en otras regiones con menos de 1 s de retraso y failover rápido
- [ ] RDS Multi-AZ || **RDS Multi-AZ** — protege ante la falla de una AZ, no de una región
- [ ] Snapshots copiados a otra región || **Snapshots entre regiones** — restaurar toma mucho más
- [ ] Una read replica en la misma región || **Read replica local** — no cubre otra región

![Aurora](https://icon.icepanel.io/AWS/svg/Database/Aurora.svg)

## ¿Cuál es el tiempo máximo de ejecución de una función AWS Lambda?

- [ ] 5 minutos || **5 minutos** — era el límite antiguo
- [x] 15 minutos || **15 minutos** — para tareas más largas: ECS/Fargate, Step Functions o AWS Batch
- [ ] 1 hora || **1 hora** — Lambda no llega a eso
- [ ] Sin límite || **Sin límite** — Lambda siempre tiene un tope

![Lambda](https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg)

## Quieres exponer funciones Lambda como una API REST con autenticación, límites de peticiones y caché. ¿Qué pones delante?

- [x] Amazon API Gateway || **API Gateway** — publica la API, autentica (Cognito, IAM, Lambda authorizer), limita y cachea
- [ ] Un Network Load Balancer || **NLB** — no maneja autenticación ni límites por cliente
- [ ] Amazon SQS || **SQS** — es una cola, no una API
- [ ] Amazon Route 53 || **Route 53** — solo resuelve nombres

![API Gateway](https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg)

## Cada vez que se sube una imagen a un bucket de S3 se debe crear una miniatura, sin servidores. ¿Cuál es el diseño típico?

- [x] Un evento de S3 que invoca una función Lambda || **S3 → Lambda** — S3 notifica la subida y Lambda procesa la imagen
- [ ] Una instancia EC2 que revisa el bucket cada minuto || **EC2 sondeando** — requiere servidores y gasta de más
- [ ] CloudFormation || **CloudFormation** — crea infraestructura, no procesa archivos
- [ ] Route 53 || **Route 53** — es DNS

## Un sistema de pedidos recibe picos que el procesador no alcanza a atender. ¿Cómo los desacoplas sin perder pedidos?

- [x] Poniendo una cola SQS entre ambos || **Cola SQS** — guarda los mensajes hasta que los consumidores los procesan a su ritmo
- [ ] Con SNS directo al procesador || **SNS directo** — empuja todo de inmediato, sin amortiguar
- [ ] Aumentando el tamaño de la instancia || **Instancia más grande** — no absorbe picos sin límite
- [ ] Con CloudFront || **CloudFront** — cachea contenido, no procesa pedidos

![SQS](https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg)

## Un mismo evento debe llegar a tres sistemas distintos, cada uno con su propia cola. ¿Qué patrón usas?

- [x] Fan-out: un tema SNS con tres colas SQS suscritas || **SNS + SQS (fan-out)** — SNS copia el mensaje a cada cola suscrita
- [ ] Una sola cola SQS compartida || **Una cola compartida** — cada mensaje lo recibe solo un consumidor
- [ ] Tres funciones Lambda encadenadas || **Lambdas encadenadas** — acopla los sistemas
- [ ] Kinesis con un solo consumidor || **Kinesis con un consumidor** — no reparte a tres sistemas

![SNS](https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Notification-Service.svg)

## Las transacciones de una cuenta bancaria deben procesarse en orden estricto y sin duplicados. ¿Qué cola usas?

- [ ] SQS Standard || **SQS Standard** — orden aproximado y entrega al menos una vez (puede duplicar)
- [x] SQS FIFO || **SQS FIFO** — orden estricto por grupo de mensajes y procesamiento exactamente una vez
- [ ] SNS Standard || **SNS Standard** — no garantiza orden
- [ ] Una tabla de DynamoDB || **DynamoDB** — es una base de datos, no una cola

## Un mensaje de SQS falla una y otra vez y bloquea el procesamiento. ¿Qué configuras?

- [x] Una dead-letter queue (DLQ) || **Dead-letter queue** — tras N intentos el mensaje se aparta para revisarlo
- [ ] Un visibility timeout de 0 || **Visibility timeout 0** — el mensaje volvería de inmediato
- [ ] Long polling || **Long polling** — reduce las consultas vacías
- [ ] Una cola FIFO || **FIFO** — no resuelve los mensajes que fallan

## Un sitio estático en S3 debe cargar rápido en todo el mundo y el bucket no debe ser público. ¿Qué usas?

- [x] CloudFront con Origin Access Control (OAC) hacia el bucket || **CloudFront + OAC** — cachea cerca del usuario y solo CloudFront puede leer el bucket
- [ ] Hacer público el bucket || **Bucket público** — no cumple el requisito
- [ ] Copiar el bucket a todas las regiones || **Copias por región** — caro y difícil de mantener
- [ ] Un Network Load Balancer || **NLB** — no sirve contenido desde S3

![CloudFront](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg)

## Tienes la aplicación en dos regiones y cada usuario debe ir a la que le responda más rápido. ¿Qué política de Route 53 usas?

- [x] Latency-based routing || **Latencia** — envía a la región con menor latencia para ese usuario
- [ ] Geolocation routing || **Geolocalización** — decide por el país o continente, no por la velocidad
- [ ] Weighted routing || **Ponderada** — reparte por porcentajes
- [ ] Simple routing || **Simple** — un único destino

![Route 53](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Route-53.svg)

## Si el sitio principal cae, el DNS debe enviar a los usuarios a un sitio de respaldo. ¿Qué configuras en Route 53?

- [x] Failover routing con health checks || **Failover + health checks** — si el primario falla la verificación, responde con el secundario
- [ ] Weighted routing al 50 % || **Ponderada 50/50** — enviaría tráfico al sitio caído
- [ ] Un TTL de un día || **TTL largo** — demoraría el cambio
- [ ] Multivalue sin health checks || **Multivalue sin chequeos** — seguiría devolviendo el sitio caído

## Quieres que `ejemplo.com` (el dominio raíz, sin www) apunte a un Application Load Balancer. ¿Qué registro de Route 53 usas?

- [ ] CNAME || **CNAME** — no se permite en el dominio raíz (apex)
- [x] Un registro Alias || **Alias** — funciona en el dominio raíz, apunta a recursos de AWS y las consultas son gratis
- [ ] Un registro A con la IP del ALB || **A con IP fija** — las IP del ALB cambian
- [ ] Un registro MX || **MX** — es para correo

## Una tabla de DynamoDB sufre *throttling* aunque la capacidad total alcanza: casi todo el tráfico usa la misma clave. ¿Qué corriges?

- [x] Elegir una clave de partición con muchos valores distintos y bien repartidos || **Mejor clave de partición** — reparte la carga entre particiones y evita las «calientes»
- [ ] Agregar un índice secundario local || **LSI** — usa la misma clave de partición
- [ ] Cambiar a una tabla global || **Tabla global** — replica entre regiones, no reparte la clave
- [ ] Activar DynamoDB Streams || **Streams** — registra cambios, no reparte la carga

![DynamoDB](https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg)

## Necesitas lecturas de DynamoDB en microsegundos, sin cambiar casi nada el código. ¿Qué agregas?

- [x] DAX (DynamoDB Accelerator) || **DAX** — caché en memoria compatible con la API de DynamoDB
- [ ] Una read replica || **Read replica** — no existe en DynamoDB
- [ ] Amazon CloudFront || **CloudFront** — es una CDN
- [ ] Un índice secundario global || **GSI** — permite otras consultas, no las acelera a microsegundos

## Una aplicación nueva tiene tráfico impredecible y con picos repentinos. ¿Qué modo de capacidad de DynamoDB eliges?

- [x] On-demand || **On-demand** — escala solo y pagas por petición
- [ ] Provisioned sin auto scaling || **Provisioned fijo** — fallaría en los picos
- [ ] Reserved capacity || **Capacidad reservada** — para uso estable y predecible
- [ ] DAX || **DAX** — es caché, no un modo de capacidad

## Usuarios en América y Europa deben escribir en DynamoDB con baja latencia en su propia región. ¿Qué usas?

- [x] Global Tables || **Global Tables** — replicación multi-región activo-activo
- [ ] DynamoDB Streams || **Streams** — flujo de cambios de una tabla
- [ ] Un GSI || **GSI** — índice dentro de la misma tabla
- [ ] DAX en cada región || **DAX** — acelera lecturas, no replica escrituras

## Cada vez que cambia un ítem de DynamoDB debe ejecutarse una función. ¿Qué activas?

- [x] DynamoDB Streams con un disparador de Lambda || **Streams + Lambda** — cada cambio queda en el flujo y Lambda lo procesa
- [ ] Una regla de ciclo de vida || **Ciclo de vida** — es de S3
- [ ] CloudTrail || **CloudTrail** — registra llamadas a la API, no cada cambio de datos
- [ ] Un TTL || **TTL** — borra ítems vencidos

## La contraseña de una base RDS debe cambiarse automáticamente cada 30 días sin tocar la aplicación. ¿Qué usas?

- [x] AWS Secrets Manager con rotación automática || **Secrets Manager** — guarda el secreto y lo rota (integrado con RDS); la app lo lee por API
- [ ] AWS KMS || **KMS** — maneja claves de cifrado, no rota contraseñas de bases de datos
- [ ] Variables de entorno de la instancia || **Variables de entorno** — habría que cambiarlas a mano
- [ ] Un archivo en S3 || **Archivo en S3** — sin rotación

![Secrets Manager](https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Secrets-Manager.svg)

SSM Parameter Store también guarda secretos, pero la **rotación automática** es propia de Secrets Manager.

## Debes controlar quién puede usar una clave de cifrado y poder desactivarla tú. ¿Qué tipo de clave de KMS eliges?

- [x] Una clave administrada por el cliente (customer managed key) || **Customer managed key** — tú defines su política, rotación y si se desactiva
- [ ] Una clave administrada por AWS || **AWS managed key** — AWS la administra; no controlas su política
- [ ] La clave de SSE-S3 || **SSE-S3** — S3 la maneja por completo
- [ ] Una contraseña en Secrets Manager || **Secreto** — no es una clave de cifrado de KMS

## Alguien borró un bucket de S3 anoche. ¿Dónde averiguas quién fue?

- [ ] Métricas de CloudWatch || **CloudWatch** — mide el rendimiento, no quién hizo cada acción
- [x] AWS CloudTrail || **CloudTrail** — registra cada llamada a la API con usuario, hora e IP
- [ ] VPC Flow Logs || **Flow Logs** — tráfico de red, no acciones sobre S3
- [ ] AWS Config || **Config** — muestra cambios de configuración, no quién borró

![CloudTrail](https://icon.icepanel.io/AWS/svg/Management-Governance/CloudTrail.svg)

## Quieres recibir un aviso cuando la CPU de una instancia pase del 80 % durante 5 minutos. ¿Qué configuras?

- [x] Una alarma de CloudWatch que notifique por SNS || **Alarma de CloudWatch + SNS** — vigila la métrica y avisa (o escala)
- [ ] Un trail de CloudTrail || **CloudTrail** — registra llamadas a la API
- [ ] Una regla de Config || **Config** — evalúa configuraciones
- [ ] Un health check de Route 53 || **Health check de Route 53** — revisa endpoints, no la CPU

![CloudWatch](https://icon.icepanel.io/AWS/svg/Management-Governance/CloudWatch.svg)

## CloudWatch no muestra el uso de memoria RAM de tus instancias EC2. ¿Por qué y cómo lo solucionas?

- [x] Es una métrica del sistema operativo: hay que instalar el agente de CloudWatch || **Agente de CloudWatch** — envía memoria, disco y logs desde dentro de la instancia
- [ ] Hay que activar el monitoreo detallado || **Monitoreo detallado** — da métricas cada minuto, pero no la memoria
- [ ] Solo existe en instancias grandes || **Instancias grandes** — ninguna la trae por defecto
- [ ] Hay que activar CloudTrail || **CloudTrail** — no mide recursos

## Quieres ejecutar contenedores en ECS sin administrar ni parchar instancias EC2. ¿Qué tipo de lanzamiento eliges?

- [x] AWS Fargate || **Fargate** — indicas CPU y memoria por tarea; AWS pone los servidores
- [ ] EC2 launch type || **EC2** — tú administras el clúster de instancias
- [ ] Lambda || **Lambda** — no ejecuta tareas de ECS
- [ ] Elastic Beanstalk || **Beanstalk** — es otra plataforma

![Fargate](https://icon.icepanel.io/AWS/svg/Containers/Fargate.svg)

## Tu empresa ya usa Kubernetes en su centro de datos y quiere llevarlo a AWS con las mismas herramientas. ¿Qué servicio usa?

- [x] Amazon EKS || **EKS** — Kubernetes administrado y compatible con las herramientas de siempre (kubectl, Helm)
- [ ] Amazon ECS || **ECS** — orquestador propio de AWS, con otra API
- [ ] AWS Lambda || **Lambda** — funciones, no contenedores de Kubernetes
- [ ] AWS Batch || **Batch** — trabajos por lotes

![EKS](https://icon.icepanel.io/AWS/svg/Containers/Elastic-Kubernetes-Service.svg)

## ¿Dónde guardas las imágenes Docker privadas que usarán ECS y EKS?

- [x] Amazon ECR || **ECR** — registro privado con permisos de IAM y escaneo de vulnerabilidades
- [ ] Amazon EFS || **EFS** — sistema de archivos
- [ ] AWS CodeCommit || **CodeCommit** — repositorio de código fuente
- [ ] Amazon EBS || **EBS** — discos de instancias

## Debes desplegar la misma pila de CloudFormation en 20 cuentas y 3 regiones a la vez. ¿Qué usas?

- [x] CloudFormation StackSets || **StackSets** — despliega y actualiza una pila en muchas cuentas y regiones
- [ ] Change sets || **Change sets** — muestran qué cambiará antes de actualizar
- [ ] Nested stacks || **Nested stacks** — reutilizan plantillas dentro de una pila
- [ ] Copiar la plantilla a mano en cada cuenta || **A mano** — lento y propenso a errores

![CloudFormation](https://icon.icepanel.io/AWS/svg/Management-Governance/CloudFormation.svg)

## Antes de actualizar una pila de CloudFormation quieres ver qué recursos se modificarán o reemplazarán. ¿Qué usas?

- [x] Un change set || **Change set** — vista previa de los cambios antes de aplicarlos
- [ ] Drift detection || **Drift detection** — detecta cambios hechos fuera de CloudFormation
- [ ] StackSets || **StackSets** — despliegue en varias cuentas
- [ ] Un rollback || **Rollback** — deshace una actualización fallida

## Debes migrar una base Oracle local a Aurora PostgreSQL con la menor interrupción posible. ¿Qué usas?

- [x] AWS SCT para convertir el esquema y AWS DMS para mover los datos || **SCT + DMS** — SCT convierte el esquema entre motores y DMS replica los datos de forma continua
- [ ] Un snapshot de RDS || **Snapshot** — la base no está en RDS
- [ ] AWS DataSync || **DataSync** — copia archivos, no bases de datos
- [ ] AWS Snowball solamente || **Solo Snowball** — no convierte el motor ni mantiene la base sincronizada

![DMS](https://icon.icepanel.io/AWS/svg/Database/Database-Migration-Service.svg)

## Debes llevar 80 TB a AWS y el enlace a internet tardaría meses. ¿Qué usas?

- [x] AWS Snowball Edge || **Snowball Edge** — AWS te envía un dispositivo, cargas los datos y lo devuelves
- [ ] AWS DataSync || **DataSync** — depende del ancho de banda
- [ ] S3 Transfer Acceleration || **Transfer Acceleration** — sigue usando tu enlace a internet
- [ ] Una VPN Site-to-Site || **VPN** — pasa por el mismo enlace

![Snowball](https://icon.icepanel.io/AWS/svg/Storage/Snowball.svg)

## Plan de recuperación ante desastres: la base de datos se replica siempre en otra región, pero los servidores se encienden solo si hay desastre. ¿Qué estrategia es?

- [ ] Backup and restore || **Backup and restore** — solo copias; la recuperación más lenta y más barata
- [x] Pilot light || **Pilot light** — lo crítico (los datos) siempre encendido y el resto se levanta al necesitarlo
- [ ] Warm standby || **Warm standby** — una copia completa pero reducida, siempre funcionando
- [ ] Multi-site activo/activo || **Multi-site** — todo funcionando en ambas regiones; el menor RTO y el mayor costo

De más barata y lenta a más cara y rápida: backup and restore → pilot light → warm standby → multi-site.

## Quieres una política única de copias de seguridad para EBS, RDS, DynamoDB y EFS, con retención y copia a otra región. ¿Qué usas?

- [x] AWS Backup || **AWS Backup** — planes de respaldo centralizados entre servicios y cuentas
- [ ] Scripts con snapshots en cada servicio || **Scripts propios** — difícil de mantener y auditar
- [ ] S3 Replication || **S3 Replication** — solo copia objetos de S3
- [ ] CloudFormation || **CloudFormation** — crea infraestructura, no copias

![Backup](https://icon.icepanel.io/AWS/svg/Storage/Backup.svg)

## Debes mover 200 servidores de tu centro de datos a EC2 tal como están (lift-and-shift), con poco tiempo de corte. ¿Qué usas?

- [x] AWS Application Migration Service || **Application Migration Service (MGN)** — replica los servidores continuamente y los lanza como instancias EC2
- [ ] AWS DMS || **DMS** — migra solo bases de datos
- [ ] AWS DataSync || **DataSync** — copia archivos
- [ ] Rehacerlos en Lambda || **Rehacer en Lambda** — es rediseñar, no lift-and-shift

![MGN](https://icon.icepanel.io/AWS/svg/Migration-Transfer/Application-Migration-Service.svg)

## Aplicaciones locales deben guardar archivos en S3 usando un recurso compartido de red (NFS/SMB) como siempre. ¿Qué usas?

- [x] AWS Storage Gateway (File Gateway) || **Storage Gateway – File Gateway** — presenta S3 como un recurso compartido local, con caché
- [ ] Amazon EFS || **EFS** — NFS dentro de AWS
- [ ] AWS Snowball || **Snowball** — traslado físico puntual
- [ ] Amazon EBS || **EBS** — discos de instancias EC2

![Storage Gateway](https://icon.icepanel.io/AWS/svg/Storage/Storage-Gateway.svg)

## Tu centro de datos necesita una conexión privada y dedicada a AWS con ancho de banda constante, sin pasar por internet. ¿Qué usas?

- [x] AWS Direct Connect || **Direct Connect** — enlace físico dedicado con latencia y ancho de banda constantes
- [ ] Una VPN Site-to-Site || **VPN Site-to-Site** — cifrada y rápida de montar, pero viaja por internet
- [ ] VPC Peering || **VPC Peering** — une dos VPC
- [ ] Un Internet Gateway || **Internet Gateway** — es la salida a internet

![Direct Connect](https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Direct-Connect.svg)

Direct Connect no va cifrado por defecto: si se exige cifrado, se agrega una VPN encima.
