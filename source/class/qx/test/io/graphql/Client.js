/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2020 Christian Boulanger

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Boulanger (cboulanger)

************************************************************************ */

qx.Class.define("qx.test.io.graphql.Client",
  {
    extend : qx.dev.unit.TestCase,
    include : [qx.test.io.MAssert],
    statics: {
      TEST_ENDPOINT: "https://countries-274616.ew.r.appspot.com/"
    },
    construct() {
      this.base(arguments);
      this.client = new qx.io.graphql.Client(this.constructor.TEST_ENDPOINT);
    },
    members : {
      async "test: run successful query"() {
        let query = `query {
          Country(name: "Switzerland") {
            name, nativeName, flag {svgFile},
            officialLanguages {name}
          }
        }`;
        let req = new qx.io.graphql.protocol.Request({query});
        let result = await this.client.send(req);
        let expected = {
          "Country": [
            {
              "name": "Switzerland",
              "nativeName": "Schweiz",
              "flag": {
                "svgFile": "https://restcountries.eu/data/che.svg"
              },
              "officialLanguages": [
                {
                  "name": "Italian"
                },
                {
                  "name": "French"
                },
                {
                  "name": "German"
                }
              ]
            }
          ]
        };
        this.assertDeepEquals(expected, result)
      }
    }
  });