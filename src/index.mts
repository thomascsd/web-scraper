import { chromium } from "playwright";
import { z } from "zod";
import OpenAI from "openai";
import LLMScraper from "llm-scraper";

const model = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
const browser = await chromium.launch();
const scraper = new LLMScraper(browser, model);

const schema = z.object({
  list: z.array(
    z.object({
      title: z.string(),
      at: z.string(),
      up: z.number(),
      time: z.string(),
    })
  ),
});

const urls = ["https://www.echojs.com/"];

const pages = await scraper.run(urls, {
  schema,
  mode: "html",
  closeOnFinish: true,
});

for await (const page of pages) {
  console.log(page.data);
}
