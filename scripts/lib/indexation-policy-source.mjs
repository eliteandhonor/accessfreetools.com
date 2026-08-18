import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import ts from 'typescript';

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return '';
}

function booleanProperty(object, name) {
  const property = object.properties.find(
    (candidate) => ts.isPropertyAssignment(candidate) && propertyName(candidate.name) === name,
  );
  if (!property || !ts.isPropertyAssignment(property)) return undefined;
  if (property.initializer.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (property.initializer.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

export function readExplicitIndexationPolicies(rootDir = resolve('.')) {
  const sourcePath = resolve(rootDir, 'src', 'data', 'indexationPolicy.ts');
  const source = readFileSync(sourcePath, 'utf8');
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true);
  const policies = new Map();

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'explicitPolicies' &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const property of node.initializer.properties) {
        if (!ts.isPropertyAssignment(property) || !ts.isObjectLiteralExpression(property.initializer)) continue;
        const path = propertyName(property.name);
        if (!path) continue;
        policies.set(path, {
          index: booleanProperty(property.initializer, 'index'),
          includeInXmlSitemap: booleanProperty(property.initializer, 'includeInXmlSitemap'),
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return policies;
}

export function isIndexablePath(path, rootDir = resolve('.')) {
  return readExplicitIndexationPolicies(rootDir).get(path)?.index !== false;
}
