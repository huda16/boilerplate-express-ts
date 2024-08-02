import amqp from "amqplib";

// Define an interface for the producer service
interface ProducerServiceInterface {
  sendMessage(queue: string, message: string): Promise<void>;
}

// Implement the producer service
const ProducerService: ProducerServiceInterface = {
  async sendMessage(queue: string, message: string): Promise<void> {
    try {
      const {
        RABBITMQ_HOST,
        RABBITMQ_PORT,
        RABBITMQ_USER,
        RABBITMQ_PASS,
        RABBITMQ_VHOST,
      } = process.env;

      // Create a connection string with credentials and vhost
      const connectionString = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VHOST}`;

      const connection = await amqp.connect(connectionString);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.sendToQueue(queue, Buffer.from(message));

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      console.error("Error sending message to queue:", error);
      throw new Error("Error sending message to queue");
    }
  },
};

export default ProducerService;
