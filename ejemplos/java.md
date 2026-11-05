# Java

Fundamentos de Java: lenguaje, programación orientada a objetos, colecciones, excepciones, streams, concurrencia y el ecosistema.

## ¿Qué permite que el mismo programa Java se ejecute en distintos sistemas operativos?

- [x] La JVM ejecuta el bytecode generado por el compilador
- [ ] El código fuente se compila a código nativo para cada sistema
- [ ] Java solo funciona en Windows
- [ ] El navegador interpreta el programa

"Escribe una vez, ejecuta en cualquier lugar": el compilador genera bytecode y cada plataforma tiene su JVM.

## ¿Cuál es la diferencia entre JDK, JRE y JVM?

- [x] JDK = herramientas de desarrollo + JRE; JRE = bibliotecas + JVM; JVM = ejecuta el bytecode
- [ ] Son tres nombres del mismo componente
- [ ] La JVM incluye al JDK
- [ ] El JRE contiene el compilador javac

Para desarrollar necesitas el JDK; para solo ejecutar basta un entorno de ejecución.

## ¿Qué comando compila un archivo `Hola.java`?

Respuesta: javac Hola.java

Genera `Hola.class` con el bytecode; luego se ejecuta con `java Hola`.

## ¿Cuál es la firma correcta del método de entrada de una aplicación Java?

- [x] `public static void main(String[] args)`
- [ ] `public void main(String args)`
- [ ] `static int main()`
- [ ] `public static main(String[] args)`

Debe ser público, estático, sin retorno y recibir un arreglo de String.

## ¿Cuál de estos NO es un tipo primitivo de Java?

- [x] String
- [ ] int
- [ ] boolean
- [ ] double

`String` es una clase (tipo de referencia). Los primitivos son byte, short, int, long, float, double, char y boolean.

## ¿Qué imprime este código?

```java
String a = new String("hola");
String b = new String("hola");
System.out.println(a == b);
```

- [x] false
- [ ] true
- [ ] hola
- [ ] Error de compilación

`==` compara referencias y son dos objetos distintos. Para comparar el contenido se usa `equals`.

## ¿Qué método se debe usar para comparar el contenido de dos String?

Respuesta: equals

`a.equals(b)` compara el texto; `==` compara si son el mismo objeto.

## ¿Qué significa que `String` sea inmutable?

- [x] Una vez creado, su contenido no puede modificarse; las operaciones devuelven un nuevo String
- [ ] No puede ser comparado
- [ ] No puede ser nulo
- [ ] Solo puede tener 255 caracteres

Para muchas concatenaciones en un bucle conviene usar `StringBuilder`.

## ¿Qué pilar de la programación orientada a objetos permite que una clase hija reutilice atributos y métodos de otra?

- [x] Herencia
- [ ] Encapsulamiento
- [ ] Abstracción
- [ ] Sobrecarga

En Java se expresa con `extends`.

## ¿Qué es el polimorfismo?

- [x] Tratar objetos de distintas clases a través de un tipo común, ejecutando cada uno su propia versión del método
- [ ] Declarar varias variables con el mismo nombre
- [ ] Ocultar los atributos de una clase
- [ ] Heredar de varias clases a la vez

Por ejemplo, una variable de tipo `Animal` que llama a `hacerSonido()` ejecuta la versión de `Perro` o `Gato`.

## ¿Cuál es la diferencia entre sobrecarga (overload) y sobrescritura (override)?

- [x] Sobrecarga: mismo nombre con distintos parámetros; sobrescritura: una subclase redefine un método heredado
- [ ] Son lo mismo
- [ ] La sobrecarga ocurre solo entre clases hijas
- [ ] La sobrescritura cambia la lista de parámetros

La sobrecarga se resuelve en compilación y la sobrescritura en ejecución.

## ¿Qué diferencia hay entre una clase abstracta y una interfaz?

- [x] Una clase puede extender una sola clase abstracta pero implementar varias interfaces
- [ ] Las interfaces pueden tener constructores
- [ ] Una clase puede extender varias clases abstractas
- [ ] Las clases abstractas no pueden tener métodos concretos

La interfaz define un contrato; la clase abstracta puede además tener estado y comportamiento común.

## ¿Qué palabra clave impide que una clase sea heredada?

Respuesta: final

También impide reasignar una variable o sobrescribir un método.

## ¿Qué modificador de acceso permite el acceso solo dentro de la propia clase?

- [x] private
- [ ] protected
- [ ] public
- [ ] el acceso por defecto (sin modificador)

Es la base del encapsulamiento: los atributos suelen ser privados con getters y setters.

## ¿Qué hace la palabra clave `static` en un método?

- [x] Lo asocia a la clase y se puede llamar sin crear una instancia
- [ ] Lo hace inmutable
- [ ] Lo hace accesible solo desde el mismo paquete
- [ ] Impide que sea sobrescrito

Un método estático no puede usar directamente miembros de instancia.

## ¿Qué interfaz de colecciones NO permite elementos duplicados?

- [x] Set
- [ ] List
- [ ] Queue
- [ ] ArrayList

`HashSet` es una implementación habitual de `Set`.

## ¿Cuál es la ventaja de `ArrayList` frente a `LinkedList` para acceder a un elemento por posición?

- [x] El acceso por índice es O(1)
- [ ] La inserción en medio es siempre más rápida
- [ ] No permite duplicados
- [ ] Consume menos memoria que un arreglo

`LinkedList` debe recorrer los nodos, así que el acceso por índice es O(n).

## ¿Qué estructura de datos de Java almacena pares clave-valor?

- [x] Map (por ejemplo HashMap)
- [ ] Set
- [ ] Stack
- [ ] Iterator

Las claves son únicas y el acceso promedio de `HashMap` es O(1).

## ¿Qué método debe sobrescribirse junto con `equals` para que un objeto funcione bien como clave de un `HashMap`?

Respuesta: hashCode

Dos objetos iguales según `equals` deben tener el mismo `hashCode`.

## ¿Cuál es la diferencia entre una excepción comprobada (checked) y una no comprobada (unchecked)?

- [x] La comprobada debe capturarse o declararse con `throws`; la no comprobada (RuntimeException) no obliga
- [ ] La no comprobada debe declararse siempre
- [ ] Solo las comprobadas pueden lanzarse
- [ ] No hay diferencia

`IOException` es comprobada; `NullPointerException` no lo es.

## ¿Qué ventaja ofrece try-with-resources?

- [x] Cierra automáticamente los recursos que implementan `AutoCloseable`
- [ ] Evita todas las excepciones
- [ ] Ejecuta el bloque en otro hilo
- [ ] Permite no usar catch

Evita fugas de archivos o conexiones sin necesidad de un bloque `finally`.

## ¿Qué imprime este código?

```java
List<Integer> n = List.of(1, 2, 3, 4);
System.out.println(n.stream().filter(x -> x % 2 == 0).map(x -> x * 10).toList());
```

- [x] [20, 40]
- [ ] [10, 30]
- [ ] [2, 4]
- [ ] [1, 2, 3, 4]

Se filtran los pares (2 y 4) y luego se multiplican por 10.

## ¿Qué es una expresión lambda?

- [x] Una forma abreviada de implementar una interfaz funcional
- [ ] Un tipo de excepción
- [ ] Un modificador de acceso
- [ ] Una clase interna estática

Ejemplo: `x -> x * 2` implementa una interfaz con un único método abstracto.

## ¿Para qué sirve `Optional`?

- [x] Representar un valor que puede estar ausente, evitando comprobaciones de null
- [ ] Hacer opcionales los parámetros de un método
- [ ] Marcar un método como opcional de implementar
- [ ] Crear hilos opcionales

Obliga al código que lo usa a considerar el caso en que no hay valor.

## ¿Qué hace la palabra clave `synchronized`?

- [x] Permite que solo un hilo a la vez ejecute el bloque o método sobre el mismo monitor
- [ ] Hace que el método se ejecute en un hilo nuevo
- [ ] Hace que la variable sea constante
- [ ] Acelera la ejecución del método

Evita condiciones de carrera al acceder a datos compartidos.

## ¿Qué es el recolector de basura (garbage collector)?

- [x] El proceso de la JVM que libera automáticamente la memoria de objetos que ya no son alcanzables
- [ ] Una herramienta que borra archivos temporales
- [ ] Un método que debe llamarse para liberar objetos
- [ ] Un tipo de excepción

El programador no libera memoria manualmente, pero puede haber fugas si mantiene referencias innecesarias.

## ¿Qué es un `record` en Java moderno?

- [x] Una clase concisa e inmutable para datos, con constructor, getters, `equals`, `hashCode` y `toString` generados
- [ ] Un tipo para guardar grabaciones de audio
- [ ] Una anotación de logging
- [ ] Un reemplazo de las interfaces

Ejemplo: `record Punto(int x, int y) {}`.

## ¿Qué herramienta se usa habitualmente en Java para gestionar dependencias y construir el proyecto?

- [x] Maven o Gradle
- [ ] npm
- [ ] pip
- [ ] Cargo

Ambas descargan dependencias, compilan, ejecutan pruebas y empaquetan el proyecto.

## ¿Qué framework simplifica la creación de aplicaciones Java con configuración automática y servidor embebido?

- [x] Spring Boot
- [ ] Hibernate
- [ ] JUnit
- [ ] Log4j

Spring Boot reduce la configuración necesaria para crear servicios web y aplicaciones empresariales.
