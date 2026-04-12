import { useMemo } from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  matchPath,
} from 'react-router-dom'
import { PersonProfile } from './PersonProfile'
import { GiftItem, PersonData } from '../data/gifts'

export interface PersonProfilePageProps {
  peopleList: PersonData[]
  giftsList: GiftItem[]
  onEditPerson: (person: PersonData) => void
  onAddGift: (personName: string) => void
}

export function PersonProfilePage({
  peopleList,
  giftsList,
  onEditPerson,
  onAddGift,
}: PersonProfilePageProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const routeMatch = matchPath(
    { path: '/people/:personName', end: true },
    pathname,
  )
  const personName = routeMatch?.params.personName ?? ''

  const person = useMemo(() => {
    if (!personName) return null
    return peopleList.find((p) => p.name === personName) ?? null
  }, [personName, peopleList])

  if (!personName) {
    return <Navigate to="/" replace />
  }
  if (!person) {
    return <Navigate to="/" replace />
  }

  return (
    <PersonProfile
      person={person}
      gifts={giftsList}
      onBack={() => navigate('/')}
      backLabel="My Gift History"
      onEditPerson={onEditPerson}
      onAddGift={onAddGift}
    />
  )
}
