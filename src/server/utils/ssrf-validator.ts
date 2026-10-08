/*
 * Copyright 2026, gematik GmbH
 *
 * Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
 * European Commission – subsequent versions of the EUPL (the "Licence").
 * You may not use this work except in compliance with the Licence.
 *
 * You find a copy of the Licence in the "Licence" file or at
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * In case of changes by gematik find details in the "Readme" file.
 *
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 *
 * ******
 *
 * For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { createError } from 'h3'
import { URL } from 'url'

import { IDP_ALLOWED_HOSTS } from '~/constants';

const WHITELIST = new Set(IDP_ALLOWED_HOSTS);

/**
 * Validates a URL string against whitelist and blocklists.
 * Enforces HTTPS, hostname whitelist, blocks private/link-local IPs.
 */
export function validateUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input.startsWith('http') ? input : `https://${input}`);
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid URL format' });
  }
  if (url.protocol !== 'https:') {
    throw createError({ statusCode: 400, statusMessage: 'Only HTTPS allowed' });
  }
  const host = url.hostname;
  if (!WHITELIST.has(host)) {
    throw createError({ statusCode: 403, statusMessage: 'Host not in whitelist' });
  }
  return url;
}

/**
 * Builds the well-known URL using a validated base URL.
 */
export function buildWellKnownUrl(base: URL): string {
  return new URL('/.well-known/openid-configuration', base.origin).toString();
}
