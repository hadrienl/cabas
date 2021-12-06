import { FC } from 'react';
import slug from 'slug';

import Box from 'components/Box';
import { Producer } from 'types/Entities';
import Text from 'components/Text';

import { useTranslation } from 'lib/i18n';
import CardContainer from './CardContainer';
import Link from 'components/Link';
import Markdown from 'components/Markdown';

interface ProducerCardProps
  extends Pick<Producer, 'id' | 'name' | 'photo' | 'description'> {
  link?: string;
}

export const ProducerCard: FC<ProducerCardProps> = ({
  id,
  name,
  photo,
  description,
  link = `/producer/${id}-${slug(name)}`,
}) => {
  const { t } = useTranslation();
  return (
    <CardContainer>
      <Text
        as="h2"
        flexDirection="row"
        justifyContent="space-between"
        margin={2}
      >
        <Link href={link}>{name}</Link>
      </Text>
      <Link
        href={link}
        maxHeight="200px"
        overflow="hidden"
        justifyContent="center"
      >
        {photo && <Box as="img" src={photo} alt={name} width="100%" />}
        {!photo && <Box height="200px" />}
      </Link>
      <Markdown cut={100}>{description}</Markdown>
    </CardContainer>
  );
};

export default ProducerCard;
