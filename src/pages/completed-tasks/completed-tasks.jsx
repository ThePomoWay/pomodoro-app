import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table'
import { selectAllCompletedTasks } from '../../common/state/selectors'
import { getAllCompletedTasks } from '../../common/state/thunks/TasksThunk'
import { useEffect } from 'react'


// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <span>
        Search:{' '}
        <input
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
      </span>
    )
}
 
 export default function CompletedTasks() {
    let dataCompletedTasks = useSelector(selectAllCompletedTasks)
    let dispatch = useDispatch();
    useEffect(() => {
            // todo : change this with completed tasks api
            dispatch(getAllCompletedTasks());
      }, []);

   const dataDefault = React.useMemo(
     () => [
       {
         title: '',
         readCreatedOn: '',
         readCompletedOn: '',
         totalDays: '',
         epomo: '',
         cpomo: ''
       }
     ],
     []
   )
 
   const columns = React.useMemo(
     () => [
       {
         Header: 'Title',
         accessor: 'title', // accessor is the "key" in the data
       },
       {
         Header: 'Created On',
         accessor: 'readCreatedOn',
       },
       {
         Header: 'Completed On',
         accessor: 'readCompletedOn',
       },
       {
        Header: 'Total Days taken',
        accessor: 'totalDays',
       },
       {
         Header: 'Estimated Pomos',
         accessor: 'epomo',
       },
       {
         Header: 'Completed Pomos',
         accessor: 'cpomo',
       }
     ],
     []
   )

   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
     state,
     visibleColumns,
     preGlobalFilteredRows,
     setGlobalFilter,
   } = useTable(
       { columns, data : dataCompletedTasks || dataDefault},
       useFilters,
       useGlobalFilter,
       useAsyncDebounce,
       useSortBy
    )
 
   return (
    <div>
     <table>
     <tr>
        <th
            colSpan={visibleColumns.length}
            style={{
            textAlign: 'left',
            }}
        >
            <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            />
        </th>
        </tr>
     </table>
     <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps(column.getSortByToggleProps())}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
                 <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
     </div>
   )
 }