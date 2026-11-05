# Patrones de diseño de software

Los patrones clásicos del libro de la Banda de los Cuatro (GoF): creacionales, estructurales y de comportamiento, más principios SOLID.

## ¿Qué es un patrón de diseño?

- [x] Una solución reutilizable a un problema recurrente de diseño de software
- [ ] Una librería que se instala con el gestor de dependencias
- [ ] Un algoritmo de ordenamiento
- [ ] Un formato de documentación

Es una plantilla de solución, no código listo para copiar: se adapta a cada contexto.

## ¿Cómo se clasifican los patrones del libro GoF?

- [x] Creacionales, estructurales y de comportamiento
- [ ] Frontend, backend y base de datos
- [ ] Síncronos, asíncronos y paralelos
- [ ] Públicos, privados y protegidos

Los creacionales crean objetos, los estructurales los componen y los de comportamiento reparten responsabilidades.

## ¿Qué garantiza el patrón Singleton?

- [x] Que una clase tenga una única instancia con un punto de acceso global
- [ ] Que una clase pueda tener muchas instancias idénticas
- [ ] Que un objeto sea inmutable
- [ ] Que una clase no pueda heredarse

Es útil para recursos compartidos, pero puede dificultar las pruebas y ocultar dependencias.

## ¿Cuál es un riesgo habitual del Singleton?

- [x] Estado global oculto que complica las pruebas y el acoplamiento
- [ ] Que consume más CPU que cualquier otro patrón
- [ ] Que no funciona con herencia
- [ ] Que impide usar interfaces

Muchos equipos prefieren inyección de dependencias con ciclo de vida único en lugar de un Singleton clásico.

## ¿Qué patrón delega la creación de objetos a un método que las subclases pueden redefinir?

- [x] Factory Method
- [ ] Singleton
- [ ] Observer
- [ ] Decorator

La clase base define el flujo y las subclases deciden qué objeto concreto se crea.

## ¿Qué patrón crea familias de objetos relacionados sin especificar sus clases concretas?

- [x] Abstract Factory
- [ ] Builder
- [ ] Prototype
- [ ] Adapter

Por ejemplo, una fábrica de componentes de interfaz para Windows y otra para macOS.

## ¿Para qué sirve el patrón Builder?

- [x] Construir paso a paso objetos complejos con muchos parámetros opcionales
- [ ] Clonar objetos existentes
- [ ] Convertir una interfaz en otra
- [ ] Notificar cambios a varios objetos

Evita constructores con listas enormes de parámetros y permite una sintaxis fluida.

## ¿Qué patrón crea nuevos objetos copiando uno existente?

- [x] Prototype
- [ ] Factory Method
- [ ] Builder
- [ ] Flyweight

Es útil cuando crear un objeto desde cero es costoso.

## ¿Qué problema resuelve el patrón Adapter?

- [x] Hacer que dos interfaces incompatibles trabajen juntas
- [ ] Añadir comportamiento a un objeto dinámicamente
- [ ] Simplificar un subsistema complejo
- [ ] Controlar el acceso a un objeto

Envuelve una clase existente para exponer la interfaz que espera el cliente.

## ¿Qué patrón añade responsabilidades a un objeto dinámicamente envolviéndolo, sin usar herencia?

- [x] Decorator
- [ ] Adapter
- [ ] Proxy
- [ ] Composite

En Java, los `InputStream` encadenados (`BufferedInputStream(new FileInputStream(...))`) son un ejemplo clásico.

## ¿Qué ofrece el patrón Facade?

- [x] Una interfaz simple a un subsistema complejo
- [ ] Una copia de un objeto
- [ ] Una familia de algoritmos intercambiables
- [ ] Un único punto de creación de objetos

Oculta la complejidad interna sin impedir el acceso directo a las clases del subsistema.

## ¿Qué patrón permite tratar de la misma forma a un objeto individual y a un grupo de objetos organizados en árbol?

- [x] Composite
- [ ] Decorator
- [ ] Iterator
- [ ] Mediator

Un sistema de archivos (archivos y carpetas) es el ejemplo típico.

## ¿Qué patrón controla el acceso a otro objeto a través de un sustituto con la misma interfaz?

- [x] Proxy
- [ ] Adapter
- [ ] Facade
- [ ] Bridge

Se usa para carga diferida (lazy loading), control de acceso, caché o acceso remoto.

## ¿En qué se diferencia Decorator de Proxy?

- [x] Decorator añade funcionalidad; Proxy controla el acceso al objeto real
- [ ] Decorator controla el acceso y Proxy añade funcionalidad
- [ ] No hay ninguna diferencia
- [ ] Proxy solo se usa en redes

Ambos envuelven un objeto con la misma interfaz, pero la intención es distinta.

## ¿Qué patrón define una dependencia uno-a-muchos para que, cuando un objeto cambia, se notifique automáticamente a sus dependientes?

- [x] Observer
- [ ] Mediator
- [ ] Command
- [ ] State

Es la base de los sistemas de eventos y de la programación reactiva.

## ¿Qué patrón encapsula una familia de algoritmos y los hace intercambiables en tiempo de ejecución?

- [x] Strategy
- [ ] Template Method
- [ ] State
- [ ] Visitor

Por ejemplo, distintas formas de calcular un descuento o de ordenar una lista.

## ¿Qué patrón encapsula una petición como un objeto, permitiendo deshacerla, encolarla o registrarla?

- [x] Command
- [ ] Strategy
- [ ] Observer
- [ ] Memento

Es la base de las funciones de deshacer y rehacer en los editores.

## ¿Qué patrón cambia el comportamiento de un objeto cuando cambia su estado interno?

- [x] State
- [ ] Strategy
- [ ] Observer
- [ ] Iterator

Evita largos bloques `if/switch` sobre el estado, como en una máquina de estados de un pedido.

## ¿Qué patrón define el esqueleto de un algoritmo en una clase base y deja que las subclases redefinan algunos pasos?

- [x] Template Method
- [ ] Strategy
- [ ] Factory Method
- [ ] Command

Usa herencia, mientras que Strategy usa composición.

## ¿Qué patrón permite recorrer los elementos de una colección sin exponer su estructura interna?

- [x] Iterator
- [ ] Visitor
- [ ] Composite
- [ ] Flyweight

Es lo que hay detrás del bucle `for-each` en muchos lenguajes.

## ¿Qué patrón centraliza la comunicación entre muchos objetos para que no se refieran unos a otros directamente?

- [x] Mediator
- [ ] Observer
- [ ] Facade
- [ ] Proxy

Reduce el acoplamiento: los componentes solo conocen al mediador.

## ¿Qué patrón pasa una petición por una cadena de manejadores hasta que uno la procesa?

- [x] Chain of Responsibility
- [ ] Mediator
- [ ] Command
- [ ] Decorator

Los filtros (middleware) de un servidor web funcionan así.

## ¿Qué patrón guarda y restaura el estado interno de un objeto sin violar su encapsulamiento?

- [x] Memento
- [ ] Prototype
- [ ] Command
- [ ] State

Se usa para puntos de restauración y deshacer.

## ¿Qué significa SOLID?

- [x] Cinco principios de diseño orientado a objetos: SRP, OCP, LSP, ISP y DIP
- [ ] Un patrón creacional
- [ ] Un estándar de pruebas
- [ ] Un framework de interfaces

Son Responsabilidad única, Abierto/cerrado, Sustitución de Liskov, Segregación de interfaces e Inversión de dependencias.

## ¿Qué dice el principio de responsabilidad única (SRP)?

- [x] Una clase debe tener una sola razón para cambiar
- [ ] Una clase debe tener un solo método
- [ ] Un programa debe tener una sola clase
- [ ] Una clase solo puede usarse una vez

Cada clase debe encargarse de una única responsabilidad.

## ¿Qué dice el principio abierto/cerrado (OCP)?

- [x] El código debe estar abierto a la extensión y cerrado a la modificación
- [ ] Las clases deben estar siempre abiertas a cambios
- [ ] Los archivos deben cerrarse tras usarse
- [ ] Todo debe ser público

Se añaden comportamientos nuevos sin modificar el código existente, por ejemplo con Strategy.

## ¿Qué dice el principio de inversión de dependencias (DIP)?

- [x] Los módulos de alto nivel deben depender de abstracciones, no de implementaciones concretas
- [ ] Las clases deben heredar de las dependencias
- [ ] Las dependencias deben instalarse al revés
- [ ] Los módulos de bajo nivel controlan a los de alto nivel

Es la base de la inyección de dependencias.

## ¿Qué recomienda el principio "favorecer la composición sobre la herencia"?

- [x] Reutilizar comportamiento combinando objetos, que es más flexible que heredar
- [ ] No usar nunca la herencia
- [ ] Usar siempre herencia múltiple
- [ ] Evitar las interfaces

La herencia acopla fuertemente las clases; la composición permite cambiar el comportamiento en tiempo de ejecución.
