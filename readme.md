# Photo-Sharing App backend

A project that allows users to create posts, update the posts, and delete them.

## Table of Contents

- [Introduction](#introduction)
- [Features](#Features)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

Photo-Sharing app allows the users to share photos along with their caption, allows the users to update as well as delete their posts. The users can also browse all other posts published by other users.

## Features

1. Register a user.
2. Create a post with photo, caption and description.
3. Update the post.
4. Delete the post.
5. Authentication using JWT token.

## Installation

To get started with the project, follow these steps:

### Prerequisites

- Node.js: Make sure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- npm: npm comes with Node.js, so you don't need to install it separately.
- Expressjs: Make sure that expressjs is installed on your system. You can download it from [expressjs.com](https://expressjs.com/en/starter/installing.html)
- Xampp : Xampp is also required for the project development. Get it from [apachefriends.org](https://www.apachefriends.org/download.html). Must run mysql in port 3306.

### Dependencies

The following dependencies are required for the projects:

1. Nodejs v20.9.0
2. MySQL v2.18.1
3. Multer v^1.4.5-lts.1

### Dev-Dependencies

1. Typescript v^5.4.5
2. Nodemon v^3.1.1

### Installing Dependencies

1. Clone the repository to your local device:

   ```bash
   git clone https://github.com/Jasmineb1/Photomania_backend.git

   ```

2. Navigate to the directory

   ```bash
   cd photo-sharing-app-backend

   ```

3. Use npm install command to install the dependencies

   ```bash
   npm install
   ```

# Usage

### Specify the `.env` file as per the `.env.example`

| Env Name     |       Value       |                            Description |
| ------------ | :---------------: | -------------------------------------: |
| PORT         |       5000        |           The server runs in port 5000 |
| DB_NAME      | pinterest_backend |       The name of the database created |
| DB_USERNAME  |   Your username   |       Username for the database server |
| DB_PASSWORD  |   Your password   |    The password of the database server |
| DB_HOST      |     localhost     |                   The name of the host |
| DB_PORT      |       3306        |          The port the database runs in |
| JWTSECRETKEY |  Your secret key  | Secret key used for jwt authentication |

### Make sure that mysql server is running at pot 3306.

### To run the API, use npm command.

```bash
    npm run startDev

```
