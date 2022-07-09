import { formatBytes } from "./utils";

/**
 * generate table something like this
 *
 *
 *
 *
 * |------------File/chunk Name-------------------------------------------------|----size-----|
 * | build/static/js/0.bc01d36c.chunk.js"            	       		        |     32M     |
 * |  1. assets/icons/ic-sort.svg " ----  size:21M   			        |             |
 * |  2. screens/SalesPipeline/Pagination/TablePageSwitcher.tsx	----size: 32B   |	      |
 * |-------------------------------------------------------------------------------------------
 *
 *
 */
export function getMarkdownFromJson(results: Record<string, any>[]) {
  return `
	<table>
		<tr>
			<th>File/chunk name</th>
			<th>Size</th>
		</tr>
		${getBundleRows(results)}
	</table>
`;
}
function getBundleRows(results: any) {
  let tableCell = "";
  results.forEach((bundle: any) => {
    tableCell += `
  					  <tr>
					     <td>
						${bundle.bundleName}
						<Details>
						<summary><b>Expand to get more insights</b></summary>
							${getBundleCell(bundle)}
						</Details>
					    <td>
					     <td>${formatBytes(Number(bundle.totalBytes))}</td>
					   </tr>
  				  `;
  });
  console.log({ tableCell });
  return tableCell;
}
function getBundleCell(bundle: Record<string, any>) {
  let tableCell = "";

  Object.entries(bundle.files).forEach(([fileName, { size }]: any) => {
    tableCell += `* ${fileName} ---- Size: ${formatBytes(Number(size))}`;
  });
  return tableCell;
}
