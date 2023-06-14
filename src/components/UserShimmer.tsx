function UserShimmer() {
  return (
    <div
      className='bg-gray-100 py-4 px-2 animate-pulse w-full grid items-center grid-cols-[auto_32px]'
      data-testid='user-shimmer'
    >
      <p className='rounded h-4 w-1/2 bg-gray-400' />
      <p className='rounded h-4 w-full bg-gray-400' />
    </div>
  )
}

export default UserShimmer
