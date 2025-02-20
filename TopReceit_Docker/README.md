
# Pasos para la implementación del proyecto en local - Workbench

## Paso 1: Clonar el proyecto y configurar las dependencias

1. **Clonar el proyecto**:

   Si aún no tienes el proyecto, clónalo desde el repositorio usando el siguiente comando:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <nombre_del_proyecto>
   ```

2. **Instalar las dependencias**:

   Una vez dentro de la carpeta del proyecto, ejecuta el siguiente comando para instalar todas las dependencias necesarias:

   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:

   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables con los datos necesarios para tu configuración local:

   ```env
   WEB_SERVER_PORT=8080               # Puerto de tu servidor
   MYSQL_ROOT_PASSWORD=               # Contraseña para el usuario root de MySQL
   MYSQL_DATABASE=                    # Nombre de la base de datos en Workbench
   MYSQL_USER=                        # Nombre de usuario para la base de datos
   MYSQL_PASSWORD=                    # Contraseña del usuario de la base de datos
   MAIL_USER=tu_email@gmail.com       # Correo electrónico de Gmail (si usas SMTP)
   MAIL_CLIENT_ID=client_id_aqui      # ID de cliente de Google (opcional)
   MAIL_PASSWORD=tu_contraseña_email # Contraseña de tu correo Gmail
   ENABLE_TOKEN_VALIDATION=false     # Si no se usa validación de token, dejar como false

   # Variables de conexión a MySQL
   MYSQL_HOST=localhost               # Cambiar de "mongodb" a "localhost"
   MYSQL_PORT=3306                    # Puerto por defecto para MySQL

   # Claves privadas de Firebase
   FIREBASE_PROJECT_ID=tu_project_id
   FIREBASE_CLIENT_EMAIL=tu_email@firebase
   FIREBASE_PRIVATE_KEY=tu_clave_privada
   ```

---

## Paso 2: Crear la base de datos en MySQL Workbench

1. **Abrir MySQL Workbench**:

   Si aún no tienes MySQL Workbench instalado, puedes descargarlo desde [este enlace](https://dev.mysql.com/downloads/installer/). Luego, abre el programa.

2. **Instalación de MySQL Workbench**:

   - Al iniciar la instalación, selecciona la opción **Full** en "Choosing a Setup Type".
   - Avanza en la instalación hasta llegar a la sección "Accounts and Roles", donde debes configurar las credenciales del administrador. Usa:
     - **Usuario**: `root`
     - **Contraseña**: `admin` (o la que prefieras)
   - Finaliza la instalación y haz clic en "Finish".

3. **Crear el usuario y la base de datos**:

   Con MySQL Workbench abierto y conectado a tu servidor MySQL local, ejecuta los siguientes comandos SQL para crear el usuario y la base de datos:

   - **Crear usuario**:

     ```sql
     CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
     ```

   - **Crear la base de datos**:

     Si no existe ya la base de datos `toprecipe`, crea una:

     ```sql
     CREATE DATABASE toprecipe;
     ```

   - **Conceder permisos al usuario**:

     Asegúrate de que el usuario `admin` tenga acceso completo a la base de datos `toprecipe`:

     ```sql
     GRANT ALL PRIVILEGES ON toprecipe.* TO 'admin'@'localhost';
     FLUSH PRIVILEGES;
     ```

4. **Verificar la base de datos**:

   Puedes comprobar que la base de datos fue creada correctamente y que el usuario tiene acceso con los siguientes comandos:

   ```sql
   SHOW DATABASES;
   ```

   Si la base de datos `toprecipe` no aparece, vuelve a crearla. Asegúrate de que el usuario `admin` tiene los permisos necesarios.

---

## Paso 3: Ejecutar el script de semillas (seeding)

Una vez que la base de datos y las configuraciones estén listas, puedes proceder a ejecutar el script de **seed** para llenar tu base de datos con datos iniciales (como los ingredientes).

1. **Ejecutar el comando de seed**:

   En la terminal, dentro de la carpeta del proyecto, ejecuta el siguiente comando para poblar la base de datos:

   ```bash
   npm run seed
   ```

   Este comando ejecutará el script de **seed** y añadirá los datos iniciales a la base de datos, como los ingredientes.

---

## Paso 4: Ejecutar la aplicación

Con todo configurado y la base de datos lista, puedes iniciar la aplicación en diferentes modos:

1. **Modo de desarrollo**:

   Para iniciar el servidor en modo de desarrollo, donde se recargan los cambios automáticamente:

   ```bash
   npm run start:dev
   ```

2. **Modo de producción**:

   Si ya estás listo para producción, ejecuta:

   ```bash
   npm run start:prod
   ```

3. **Verificar el servidor**:

   El servidor debería estar corriendo en el puerto configurado en el archivo `.env` (`WEB_SERVER_PORT`). Si no has cambiado nada, se ejecutará en el puerto **8080**.

   Para verificar, abre tu navegador y visita [http://localhost:3000/api](http://localhost:8080).

---

## Paso 5: Ejecutar las pruebas (opcional)

Si deseas ejecutar las pruebas unitarias o de extremo a extremo para verificar que todo esté funcionando correctamente, aun por desarrollar:

1. **Ejecutar pruebas unitarias**:

   ```bash
   npm run test
   ```

2. **Ejecutar pruebas de extremo a extremo**:

   ```bash
   npm run test:e2e
   ```

3. **Ver cobertura de pruebas**:

   ```bash
   npm run test:cov
   ```

---

## Resumen

1. Clonaste el proyecto e instalaste las dependencias.
2. Configuraste las variables en el archivo `.env` con los datos de tu base de datos y otros servicios.
3. Creaste la base de datos y configuraste el acceso en **MySQL Workbench**.
4. Ejecutaste el script de **seeding** para poblar la base de datos con los datos iniciales.
5. Iniciaste el servidor en modo desarrollo o producción.
6. (Opcional) Ejecutaste las pruebas para verificar que todo funcione correctamente.

Con estos pasos, deberías tener tu aplicación NestJS funcionando en tu entorno local con la base de datos MySQL configurada en **MySQL Workbench**.

Si necesitas alguna aclaración o ayuda adicional, no dudes en preguntar. ¡Suerte con tu proyecto!
