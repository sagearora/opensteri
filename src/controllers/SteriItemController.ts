import { Body, Get, Post, Put, Route } from "tsoa";
import steriItemHandler, { SteriItemAttributes, SteriItemInput, SteriItemOutput } from "../data/steriItemHandler";


@Route("steri_item")
export class SteriItemController {
    @Get("/")
    public async listSteriItems(): Promise<{
        items: SteriItemOutput[]
    }> {
        const items = await steriItemHandler
            .create()
            .list()
        return {
            items,
        };
    }

    @Get("/:id")
    public async getSteriItem(id: number): Promise<{
        item: SteriItemOutput
    }> {
        const item = await steriItemHandler
            .create()
            .get(id)
        return {
            item,
        };
    }

    @Post("/")
    public async createSteriItem(@Body() body: Omit<SteriItemAttributes, 'id'>): Promise<{
        item: SteriItemOutput
    }> {
        const handler = steriItemHandler
            .create()
        const id = await handler
            .insert(body)
        const item = await handler
            .get(id)
        return {
            item,
        };
    }

    @Put("/:id")
    public async updateSteriItem(id: number, @Body() body: Partial<SteriItemInput>): Promise<{
        item: SteriItemOutput
    }> {
        const handler = steriItemHandler
            .create()
        await handler
            .update(id, body)
        const item = await handler
            .get(id)
        return {
            item,
        };
    }
}