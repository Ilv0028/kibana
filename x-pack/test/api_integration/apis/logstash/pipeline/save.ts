/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../ftr_provider_context';

export default function ({ getService }: FtrProviderContext) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');
  describe('save', () => {
    const archive = 'logstash/empty';

    before('load pipelines archive', () => {
      return esArchiver.load(archive);
    });

    after('unload pipelines archive', () => {
      return esArchiver.unload(archive);
    });

    it('should create the specified pipeline', async () => {
      await supertest
        .put('/api/logstash/pipeline/fast_generator')
        .set('kbn-xsrf', 'xxx')
        .send({
          description: 'foobar baz',
          pipeline: 'input { generator {} }\n\n output { stdout {} }',
        })
        .expect(204);

      const { body } = await supertest.get('/api/logstash/pipeline/fast_generator').expect(200);

      expect(body.description).to.eql('foobar baz');
    });
  });
}
