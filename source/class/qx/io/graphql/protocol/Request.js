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

/**
 * An Object modelling a GraphQL request based on the GraphQL language
 * (see http://spec.graphql.org/draft/#sec-Language)
 */
qx.Class.define("qx.io.graphql.protocol.Request",{
  extend: qx.io.graphql.protocol.Message,
  properties: {

    /**
     * The query as a string which will be parsed and executed on the server
     */
    query : {
      check: "String",
      nullable: false,
      init: "",
      event: "changeQuery"
    },

    /**
     * A qooxdoo object that maps variable names to variable values
     */
    variables : {
      check: "qx.core.Object",
      nullable: true,
      event: "changeVariables"
    }
  },

  members: {
    /**
     * Set the variables from a native javascript object, which will be
     * marshaled into a qooxdoo object which can be used in databinding
     * @param {Object} map
     */
    marshalVariables(map) {
      this.setVariables(qx.data.marshal.Json.createModel(map));
    }
  }
});
