// app/dashboard/calendar/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

interface CalendarPost {
  id: string
  date: string
  title: string
  status: 'draft' | 'scheduled' | 'published'
  platforms: string[]
}

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [posts, setPosts] = useState<CalendarPost[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetchCalendarPosts()
  }, [currentDate])

  const fetchCalendarPosts = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/dashboard/calendar', {
        headers: {
          'x-user-id': token || '',
        },
      })

      if (response.ok) {
        const data = (await response.json()) as { posts: CalendarPost[] }
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching calendar:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    )
  }

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return posts.filter((post) => post.date.startsWith(dateStr))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500'
      case 'scheduled':
        return 'bg-blue-500'
      case 'draft':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Content Calendar</h1>
        <p className="text-gray-400">
          View and manage your 30-day content schedule across all platforms
        </p>
      </div>

      {/* Calendar View */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            <ChevronLeft className="text-white" />
          </button>
          <h2 className="text-xl font-bold text-white w-40 text-center">
            {monthName}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-800 rounded transition"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-900 border-t border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-center text-sm font-semibold text-gray-400 border-r border-gray-700 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayPosts = day ? getPostsForDate(day) : []
            const dateStr =
              day &&
              `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, '0')}-${String(day).padStart(2, '0')}`

            return (
              <div
                key={index}
                onClick={() => dateStr && setSelectedDate(selectedDate === dateStr ? null : dateStr)}
                className={`min-h-32 p-3 border-r border-b border-gray-700 cursor-pointer transition ${
                  day
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-900'
                } ${selectedDate === dateStr ? 'bg-gray-700' : ''}`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-white mb-2">{day}</div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          className={`${getStatusColor(
                            post.status
                          )} bg-opacity-30 rounded px-2 py-1 text-xs text-white truncate`}
                        >
                          {post.title}
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{dayPosts.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Posts for {new Date(selectedDate).toLocaleDateString()}
          </h3>

          <div className="space-y-3">
            {posts
              .filter((p) => p.date.startsWith(selectedDate))
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-900 rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{post.title}</h4>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`${getStatusColor(
                          post.status
                        )} bg-opacity-30 text-white px-2 py-1 rounded text-xs font-medium`}
                      >
                        {post.status}
                      </span>
                      {post.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="bg-blue-500 bg-opacity-30 text-blue-400 px-2 py-1 rounded text-xs font-medium"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-300 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox
          label="Total Posts This Month"
          value={posts.length}
          color="text-blue-400"
        />
        <StatBox
          label="Published"
          value={posts.filter((p) => p.status === 'published').length}
          color="text-green-400"
        />
        <StatBox
          label="Scheduled"
          value={posts.filter((p) => p.status === 'scheduled').length}
          color="text-yellow-400"
        />
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
