import { CountHandler } from './src/data/countHandler';
import { PrintHandler } from './src/data/printHandler';
import { SettingHandler } from './src/data/settingHandler';
import { SteriCycleHandler } from './src/data/steriCycleHandler';
import { SteriHandler } from './src/data/steriHandler';
import { SteriItemHandler } from './src/data/steriItemHandler';
import { SteriLabelHandler } from './src/data/steriLabelHandler';
import { UserHandler } from './src/data/userHandler';

export interface Datasources {
    settingHandler: SettingHandler;
    steriItemHandler: SteriItemHandler;
    userHandler: UserHandler;
    steriHandler: SteriHandler;
    steriLabelHandler: SteriLabelHandler;
    steriCycleHandler: SteriCycleHandler;
    countHandler: CountHandler;
    printHandler: PrintHandler;
}

export interface ApolloContext {
    authorization: string | undefined;
    datasources: Datasources;
}
