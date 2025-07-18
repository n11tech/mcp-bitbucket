import { Container } from 'inversify';
import { TYPES } from './types.js';
import { BitbucketConfig } from './config/BitbucketConfig.js';
import logger from './logging/logger.js';
import winston from 'winston';

// Clients
import { IBitbucketClientFacade } from '../application/facade/IBitbucketClientFacade.js';
import { BitbucketClientFacade } from '../application/facade/impl/BitbucketClientFacade.js';
import { IPullRequestClient } from '../domain/repository/IPullRequestClient.js';
import { PullRequestClient } from './clients/PullRequestClient.js';
import { IRepositoryClient } from '../domain/repository/IRepositoryClient.js';
import { RepositoryClient } from './clients/RepositoryClient.js';
import { IWorkspaceClient } from '../domain/repository/IWorkspaceClient.js';
import { WorkspaceClient } from './clients/WorkspaceClient.js';
import { ISearchClient } from '../domain/repository/ISearchClient.js';
import { SearchClient } from './clients/SearchClient.js';
import { IUserClient } from '../domain/repository/IUserClient.js';
import { UserClient } from './clients/UserClient.js';

// Use Cases
import { IBitbucketUseCase } from '../application/use-cases/IBitbucketUseCase.js';
import { BitbucketUseCase } from '../application/use-cases/impl/BitbucketUseCase.js';

// MCP Server Setup
import { McpServerSetup } from './setup/McpServerSetup.js';
import { McpHttpServer } from './http/McpHttpServer.js';

const container = new Container();

// Configuration
const bitbucketConfig: BitbucketConfig = {
    baseUrl: process.env.BITBUCKET_URL ?? '',
    token: process.env.BITBUCKET_TOKEN,
    username: process.env.BITBUCKET_USERNAME,
    password: process.env.BITBUCKET_PASSWORD,
    defaultProject: process.env.BITBUCKET_DEFAULT_PROJECT
};
container.bind<BitbucketConfig>(TYPES.BitbucketConfig).toConstantValue(bitbucketConfig);

// Logger
container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger);

// Bitbucket Clients
container.bind<IPullRequestClient>(TYPES.IPullRequestClient).to(PullRequestClient).inSingletonScope();
container.bind<IRepositoryClient>(TYPES.IRepositoryClient).to(RepositoryClient).inSingletonScope();
container.bind<IWorkspaceClient>(TYPES.IWorkspaceClient).to(WorkspaceClient).inSingletonScope();
container.bind<ISearchClient>(TYPES.ISearchClient).to(SearchClient).inSingletonScope();
container.bind<IUserClient>(TYPES.IUserClient).to(UserClient).inSingletonScope();
container.bind<IBitbucketClientFacade>(TYPES.IBitbucketClient).to(BitbucketClientFacade).inSingletonScope();

// Use Cases
container.bind<IBitbucketUseCase>(TYPES.IBitbucketUseCase).to(BitbucketUseCase).inSingletonScope();

// MCP Server Setup
container.bind<McpServerSetup>(TYPES.McpServerSetup).to(McpServerSetup).inSingletonScope();

// Server
container.bind(TYPES.Server).toDynamicValue(() => {
    const mcpServerSetup = container.get<McpServerSetup>(TYPES.McpServerSetup);
    return mcpServerSetup.server;
});

// HTTP Streaming Components
container.bind<McpHttpServer>(TYPES.McpHttpServer).to(McpHttpServer).inSingletonScope();

export { container };
