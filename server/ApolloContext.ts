import { PrintHandler } from './src/data/printHandler';
import { SteriCycleHandler } from './src/data/steriCycleHandler';
import { SteriHandler } from './src/data/steriHandler';
import { SteriItemHandler } from './src/data/steriItemHandler';
import { SteriLabelHandler } from './src/data/steriLabelHandler';
import { UserHandler } from './src/data/userHandler';

export interface Datasources {
    steriItemHandler: SteriItemHandler;
    userHandler: UserHandler;
    steriHandler: SteriHandler;
    steriLabelHandler: SteriLabelHandler;
    steriCycleHandler: SteriCycleHandler;
    printHandler: PrintHandler;
}

export interface ApolloContext {
    authorization: string | undefined;
    datasources: Datasources;
}
