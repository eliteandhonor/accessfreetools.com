export const prerender = true;
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPinterestFeedItems, pinterestBoards, type PinterestBoard } from '../../data/pinterestFeed';
import { renderPinterestRssFeed } from '../../data/pinterestFeedXml';

export const getStaticPaths = (() =>
  pinterestBoards.map((board) => ({
    params: { board: board.slug },
    props: { board },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const board = props.board as PinterestBoard;
  const body = renderPinterestRssFeed({
    title: `Access Free Tools - ${board.title}`,
    linkPath: '/tools/',
    selfPath: board.path,
    description: board.description,
    items: getPinterestFeedItems(board.slug),
    board,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
