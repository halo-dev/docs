```ts
export interface Plugin {
  apiVersion: string;
  kind: string;
  metadata: {
    annotations: {};
    creationTimestamp: string;
    deletionTimestamp: string;
    finalizers: Array<string>;
    generateName: string;
    labels: {};
    name: string;
    version: number;
  };
  spec: {
    author: {
      name: string;
      website: string;
    };
    configMapName: string;
    description: string;
    displayName: string;
    enabled: boolean;
    homepage: string;
    license: Array<{
      name: string;
      url: string;
    }>;
    logo: string;
    pluginDependencies: {};
    repo: string;
    requires: string;
    settingName: string;
    version: string;
  };
  status: {
    conditions: Array<{
      lastTransitionTime: string;
      message: string;
      reason: string;
      status: string;
      type: string;
    }>;
    entry: string;
    lastStartTime: string;
    loadLocation: string;
    logo: string;
    phase: string;
    stylesheet: string;
  };
}
```
