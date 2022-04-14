import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";

import {
  useLatestVersion,
  useVersions,
} from "@docusaurus/plugin-content-docs/client";
import VersionsArchived from "../../versionsArchived.json";

function DocumentationLabel() {
  return (
    <Translate id="versionsPage.versionEntry.link">Documentation</Translate>
  );
}

function ReleaseNotesLabel() {
  return (
    <Translate id="versionsPage.versionEntry.releaseNotes">
      Release Notes
    </Translate>
  );
}

function Version(): JSX.Element {
  const {
    siteConfig: { organizationName, projectName },
  } = useDocusaurusContext();
  const versions = useVersions();
  const latestVersion = useLatestVersion();
  const currentVersion = versions.find(
    (version) => version.name === "current"
  )!;
  const pastVersions = versions.filter(
    (version) => version !== latestVersion && version.name !== "current"
  );
  const repoUrl = `https://github.com/${organizationName}/${projectName}`;

  return (
    <Layout
      title="Versions"
      description="Docusaurus 2 Versions page listing all documented site versions"
    >
      <main className="container margin-vert--lg">
        <h1>Halo documentation versions</h1>

        {latestVersion && (
          <div className="margin-bottom--lg">
            <h3 id="next">Current version (Stable)</h3>
            <p>
              Here you can find the documentation for current released version.
            </p>
            <table>
              <tbody>
                <tr>
                  <th>{latestVersion.label}</th>
                  <td>
                    <Link to={latestVersion.path}>Documentation</Link>
                  </td>
                  <td>
                    <a href={`${repoUrl}/releases/tag/v${latestVersion.name}`}>
                      Release Notes
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {currentVersion !== latestVersion && (
          <div className="margin-bottom--lg">
            <h3 id="latest">Next version (Unreleased)</h3>
            <p>
              Here you can find the documentation for work-in-process unreleased
              version.
            </p>
            <table>
              <tbody>
                <tr>
                  <th>{currentVersion.label}</th>
                  <td>
                    <Link to={currentVersion.path}>Documentation</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {(pastVersions.length > 0 || VersionsArchivedList.length > 0) && (
          <div className="margin-bottom--lg">
            <h3 id="archive">Past versions (Not maintained anymore)</h3>
            <p>
              Here you can find documentation for previous versions of
              Docusaurus.
            </p>
            <table>
              <tbody>
                {pastVersions.map((version) => (
                  <tr key={version.name}>
                    <th>{version.label}</th>
                    <td>
                      <Link to={version.path}>
                        <DocumentationLabel />
                      </Link>
                    </td>
                    <td>
                      <a href={`${repoUrl}/releases/tag/v${version.name}`}>
                        <ReleaseNotesLabel />
                      </a>
                    </td>
                  </tr>
                ))}
                {Object.entries(VersionsArchived).map(
                  ([versionName, versionUrl]) => (
                    <tr key={versionName}>
                      <th>{versionName}</th>
                      <td>
                        <Link to={versionUrl}>
                          <DocumentationLabel />
                        </Link>
                      </td>
                      <td>
                        <Link href={`${repoUrl}/releases/tag/v${versionName}`}>
                          <ReleaseNotesLabel />
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Version;
