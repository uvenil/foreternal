// aus: https://stackoverflow.com/questions/27784212/how-to-use-radio-buttons-in-reactjs#27784932

var SearchResult = React.createClass({
 getInitialState: function () {
   return {
     site: '',
     address: ''
   };
 },
 onSiteChanged: function (e) {
   this.setState({
     site: e.currentTarget.value
     });
 },

 onAddressChanged: function (e) {
   this.setState({
     address: e.currentTarget.value
     });
 },

 render: function(){
      var resultRows = this.props.data.map(function(result){
          return (
              <tbody>
                   <tr>
                       <td><input type="radio" name="site_name" 
                                  value={result.SITE_NAME} 
                                  checked={this.state.site === result.SITE_NAME} 
                                  onChange={this.onSiteChanged} />{result.SITE_NAME}</td>
                       <td><input type="radio" name="address" 
                                  value={result.ADDRESS}  
                                  checked={this.state.address === result.ADDRESS} 
                                  onChange={this.onAddressChanged} />{result.ADDRESS}</td>
                   </tr>
              </tbody>
          );
      }, this);
      return (
          <table className="table">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Address</th>
                  </tr>
              </thead>
               {resultRows}
              <tfoot>
                  <tr>
                      <td>chosen site name {this.state.site} </td>
                      <td>chosen address {this.state.address} </td>
                  </tr>
              </tfoot>
          </table>
      );
 }