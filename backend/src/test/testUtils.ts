import server from "../server"; // Adjust the path as needed

export const startServer = () => server;
export const stopServer = async () => server.close();
