<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card-group deck>
          <b-card header="APIs">
            <b-list-group>
              <b-list-group-item button v-for="item in apis" @click="select(item)">
                {{ item.title }}
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-card-group>
      </b-col>
      <b-col cols="8">
        <b-card-group deck>
          <b-card header="Request & Response">
            <b-card-body>
              <b-card-title v-if="title">{{ title }}</b-card-title>
              <b-card-title v-else>左のリストからAPIを選択してください</b-card-title>
              <div v-if="uri">
                <b-card-sub-title>{{ uri }}</b-card-sub-title>
                <b-card-text>このAPIを実行するときはボタンを押してね</b-card-text>
                <b-button variant="primary" @click="send(uri)">実行</b-button>
              </div>
              <div v-if="is_sending">
                <hr>
                <b-spinner label="Spinning"></b-spinner>
              </div>
              <div v-if="has_response">
                <hr>
                <pre><code>{{ response }}</code></pre>
              </div>
            </b-card-body>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const axios = require('axios');

let base_uri = process.env.baseUri || 'http://localhost:3000/api';

export default {
  data: function() {
    return {
      apis: [
        {
          title: '陽性患者発表情報',
          path: 'patients',
        },
        {
          title: '検査実施数',
          path: 'test-cases',
        },
        {
          title: '検査陽性者の状況',
          path: 'patients-summary',
        },
        {
          title: '相談ダイヤル相談件数',
          path: 'contact-dial-cases',
        },
        {
          title: '帰国者・接触者相談センター相談件数',
          path: 'quarantine-center-cases',
        },
      ],
      title: '',
      uri: '',
      is_sending: false,
      has_response: false,
      response: '',
    }
  },
  methods: {
    select: function(item) {
      this.$store.commit('apis/set_api', {
        title: item.title,
        path: item.path,
      });
      this.title = item.title;
      this.uri = `${base_uri}/${item.path}`;
      this.is_sending = false;
      this.has_response = false;
      this.response = '';
    },
    send: function(uri) {
      this.is_sending = true;
      axios.get(uri)
        .then((res) => {
          this.is_sending = false;
          this.has_response = true;
          this.response = res.data;
          console.log('response', res.data);
        });
    },
  },
}
</script>