export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const postData = req.body;

      console.log("New postData", postData);

      // Assuming addNewPost is an asynchronous operation, use async/await
      await req.appContext.addNewPost(postData);

      res.statusCode = 200;
      res.end('Webhook received');
    } catch (error) {
      console.error('Error passing webhook:', error);
      res.statusCode = 500;
      res.end('Error passing webhook');
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
}
